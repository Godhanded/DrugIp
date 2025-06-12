import torch
from torch_geometric.utils import from_smiles
from torch_geometric.nn import AttentiveFP
from rdkit import Chem
from rdkit.Chem import QED, Descriptors
from rdkit.Chem.Lipinski import NumHDonors, NumHAcceptors
import sascorer  # make sure sascorer.py is available

# Device setup (use GPU if available)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


class GraphFeaturizer:
    def featurize(self, smiles_list, y_values=None):
        graph_list = []
        for i, smiles in enumerate(smiles_list):
            try:
                g = from_smiles(smiles)
                g.x = g.x.float()
                if y_values is not None:
                    y = torch.tensor(y_values[i], dtype=torch.float32).view(1, -1)
                    g.y = y
                graph_list.append(g)
            except Exception as e:
                print(f"Error processing {smiles}: {e}")
                graph_list.append(None)
        return graph_list

def predict_smiles_toxicity(smiles, model_path="toxicity_model.pth"):
    model = AttentiveFP(
        in_channels=9,
        hidden_channels=128,
        out_channels=4,
        edge_dim=3,
        num_layers=6,
        num_timesteps=2,
        dropout=0.3
    ).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    featurizer = GraphFeaturizer()
    graph = featurizer.featurize([smiles])[0]
    if graph is None:
        print("Invalid SMILES or featurization failed.")
        return None

    graph = graph.to(device)

    with torch.no_grad():
        out = model(
            graph.x, graph.edge_index, graph.edge_attr,
            batch=torch.zeros(graph.num_nodes, dtype=torch.long, device=device)
        )
        probs = torch.sigmoid(out)

    labels = ["SR-p53", "SR-ARE", "NR-AhR", "NR-AR"]
    return {label: probs[0, i].item() for i, label in enumerate(labels)}

def compute_physchem_properties(mol):
    mw = Descriptors.MolWt(mol)
    logp = Descriptors.MolLogP(mol)
    h_donors = NumHDonors(mol)
    h_acceptors = NumHAcceptors(mol)
    return mw, logp, h_donors, h_acceptors

def lipinski_rule(mw, logp, h_donors, h_acceptors):
    return (mw <= 500) and (logp <= 5) and (h_donors <= 5) and (h_acceptors <= 10)

def check_eligibility(smiles, model_path="toxicity_model.pth"):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError("Invalid SMILES string")

    # Compute properties
    mw, logp, h_donors, h_acceptors = compute_physchem_properties(mol)
    lipinski_pass = lipinski_rule(mw, logp, h_donors, h_acceptors)
    qed = QED.qed(mol)
    sa_score = sascorer.calculateScore(mol)

    tox_pred = predict_smiles_toxicity(smiles, model_path=model_path)
    if tox_pred is None:
        raise ValueError("Toxicity prediction failed")
    tox_score = max(tox_pred.values())

    eligible = (qed >= 0.4) and lipinski_pass and (sa_score <= 5) and (tox_score < 0.5)

    return {
        "qed": qed,
        "sa_score": sa_score,
        "tox_pred": tox_pred,
        "tox_score": tox_score,
        "eligible": eligible,
        "mw": mw,
        "logp": logp,
        "num_h_donors": h_donors,
        "num_h_acceptors": h_acceptors,
        "lipinski_pass": lipinski_pass
    }
#usage
if __name__ == "__main__":
    test_smiles = "O=C(Nc1nc2ccc(Cl)cc2s1)c1ccc(F)cc1"  # example: acetaminophen
    results = check_eligibility(test_smiles, model_path="Sagemaker/toxicity_model.pth")
    print(results)