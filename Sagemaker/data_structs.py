import numpy as np
import re 
import torch
from torch.utils.data import Dataset
import numpy as np
import re


class Vocabulary(object):
    def __init__(self, file, max_length= 140):
        self.special_tokens = ["[PAD]", "[EOS]", "[GO]"]
        self.additional_chars = self.init_from_file(file)
        self.chars = self.special_tokens + self.additional_chars
        self.vocab_size = len(self.chars)
        self.vocab = dict(zip(self.chars, range(len(self.chars))))
        self.reversed_vocab = {v:k for k, v in self.vocab.items()}
        self.max_length = max_length 

    def init_from_file(self, file):
        with open(file, 'r') as f:
            chars = f.read().split()
        return chars

    def tokenize(self, smiles):
        regex = '(\[[^\[\]]{1,6}\])'
        smiles = self.replace_halogen(smiles)
        char_list = re.split(regex, smiles)
        tokenized = []
        for char in char_list:
            if char.startswith('['):
                tokenized.append(char)
            else:
                chars = [unit for unit in char]
                [tokenized.append(unit) for unit in chars]
        tokenized.append("[EOS]")
        return tokenized
    
    def encode(self, char_list):
        smiles_tensor = torch.zeros(len(char_list), dtype=torch.float32)
        for i, char in enumerate(char_list):
            smiles_tensor[i] = self.vocab[char]
        return smiles_tensor

    def decode(self, matrix):
        matrix = [int(i) for i in matrix]
        chars = []
        for i in matrix:
            if i == self.vocab["[EOS]"]:
                break
            chars.append(self.reversed_vocab[i])
        smiles = "".join(chars)
        smiles = self.restore_halogen(smiles)
        return smiles
    
    def replace_halogen(self,smiles):
        return smiles.replace("Cl", "L").replace("Br", "R")

    def restore_halogen(self,smiles):
        return smiles.replace("L", "Cl").replace("R", "Br")


class MolData(Dataset):
    def __init__(self, fname, voc):
        self.voc = voc
        self.smiles = []
        with open(fname, 'r') as f:
            for line in f:
                self.smiles.append(line.split()[0])
    
    def __getitem__(self, index):
        mol = self.smiles[index]
        tokenized = self.voc.tokenize(mol)
        encoded = self.voc.encode(tokenized)
        return encoded.clone().detach()

    def __len__(self):
        return len(self.smiles)

    @classmethod
    def collate_fn(cls, arr):
        """Function to take a list of encoded sequences and turn them into a batch"""
        max_length = max([seq.size(0) for seq in arr])
        collated_arr = torch.zeros(len(arr), max_length)
        for i, seq in enumerate(arr):
            collated_arr[i, :seq.size(0)] = seq
        return collated_arr
    
    

