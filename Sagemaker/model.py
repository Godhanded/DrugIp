import torch 
import torch.nn as nn
import torch.nn.functional as F

device = torch.device("mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu")

class AutoregressiveTransformer(nn.Module):
    def __init__(self, vocab_size, d_model, n_layer, n_head, dropout, max_len):
        super().__init__()
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.position_embedding = nn.Embedding(max_len, d_model)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model = d_model,
            nhead = n_head,
            dim_feedforward= 4 * d_model,
            dropout= dropout,
            batch_first= True
        )
        self.transformer =nn.TransformerEncoder(encoder_layer, num_layers =n_layer)
        self.output_head = nn.Linear(d_model, vocab_size)

    def forward(self, input_ids):
        B, T = input_ids.size()
        pos = torch.arange(T, device= input_ids.device).unsqueeze(0).expand(B, T)
        x = self.token_embedding(input_ids) + self.position_embedding(pos)

        attn_mask = torch.triu(torch.ones(T, T, device= input_ids.device), diagonal=1).bool()
        x = self.transformer(x, mask = attn_mask)
        return self.output_head(x)

class TransformerModel(nn.Module):
    def __init__(self, vocab):
        super().__init__()
        self.vocab = vocab
        self.eos_token = vocab.vocab["[EOS]"]
        self.pad_token = vocab.vocab["[PAD]"]
        self.start_token = vocab.vocab["[GO]"]
        self.max_len = 200

        self.model = AutoregressiveTransformer(
            vocab_size= vocab.vocab_size,
            d_model= 256,
            n_head= 16,
            n_layer= 8,
            dropout= 0.1,
            max_len = self.max_len,
        ).to(device)
    
    def compute_loss(self, seqs):
        seqs = seqs[:, :self.max_len - 1]
        start_token = torch.full((seqs.size(0), 1), self.start_token, dtype=seqs.dtype, device=seqs.device)
        seqs = torch.cat([start_token, seqs], dim =1).to(device)
        logits = self.model(seqs[:, :-1])
        targets = seqs[:, 1:]
        return F.cross_entropy(
            logits.view(-1, logits.size(-1)),
            targets.reshape(-1),
            ignore_index= self.pad_token
        )
    
    def sample(self, batch_size, max_length=200):
        start_token = torch.full((batch_size, 1), self.start_token, dtype=torch.long, device= device)
        x = start_token
        for step in range(max_length):
            logits = self.model(x)
            next_token_logits = logits[:, -1, :]
            probs = F.softmax(next_token_logits, dim=-1)
            next_token = torch.multinomial(probs, num_samples=1)
            x = torch.cat([x, next_token], dim=1)
            if (next_token == self.eos_token).all():
                break
        return x[:, 1:]








