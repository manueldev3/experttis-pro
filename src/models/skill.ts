export interface SkillInterface {
    quantity: number;
    topicDescription: string;
}

export default class Skill {
    quantity: number;
    topicDescription: string;

    constructor(data: SkillInterface) {
        this.quantity = data.quantity;
        this.topicDescription = data.topicDescription;
    }
}