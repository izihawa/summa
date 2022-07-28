from typing import Union, Callable
from izihawa_nlptools.morph import EnglishMorphology, RussianMorphology

from ..parser.elements import (
    Boost,
    SynonymsGroup,
    Word,
)
from .base import TreeTransformer


def default_score(word, all_words):
    return "{:.3f}".format(1 / len(all_words))


class MorphyTreeTransformer(TreeTransformer):
    """
    Creates forms of words
    """
    morphology = {
        'en': EnglishMorphology(),
        'ru': RussianMorphology()
    }

    def __init__(self, enable_morph=True, enable_accent=True, score: Union[str, Callable] = default_score, ignore_nodes=None):
        super().__init__(ignore_nodes=ignore_nodes)
        self.enable_morph = enable_morph
        self.enable_accent = enable_accent
        self.score = score

    def visit_word(self, node, context, parents=None):
        syn_forms = []

        if self.enable_accent and 'ё' in node.value:
            syn_forms.append(Word(node.value.replace('ё', 'е')))

        if self.enable_morph and context.language in self.morphology:
            for w in self.morphology[context.language].derive_forms(node.value):
                if node.value != w:
                    syn_forms.append(Word(w))

        if len(syn_forms) == 0:
            return node, True

        forms = [node]
        for syn_form in syn_forms:
            if callable(self.score):
                forms.append(Boost(syn_form, score=self.score(syn_form, syn_forms)))
            else:
                forms.append(Boost(syn_form, score=self.score))

        return SynonymsGroup(*forms), True
