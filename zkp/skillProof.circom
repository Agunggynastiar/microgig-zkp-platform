template SkillProof() {
    signal input skill;
    signal input issuer;
    signal input expectedSkill;

    signal hash;
    hash <== skill + issuer;

    // constraint: skill harus sama
    skill === expectedSkill;
}

component main = SkillProof();