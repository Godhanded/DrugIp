from model import TransformerModel
from data_structs import Vocabulary
import torch

device = torch.device("mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu")
vocab = Vocabulary("Voc.txt")
model = TransformerModel(vocab)
model.load_state_dict(torch.load("generative-model.ckpt", map_location=device))
model.eval()


# with torch.no_grad():
#     output = model.sample(100)
#     decoded = [vocab.decode(seq.tolist()) for seq in output]
#     for i, seq in enumerate(decoded): print(f"Sample {i+1}: {seq}")

def gen_smile(samp_size:int):
    with torch.no_grad():
        output = model.sample(samp_size)
        decoded = [vocab.decode(seq.tolist()) for seq in output]
        return decoded