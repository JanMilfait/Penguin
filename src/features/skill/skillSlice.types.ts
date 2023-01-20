export type GetSkillArg = {id: number};

export type SearchSkill = {
  id: number;
  name: string;
  tag: string;
  users_count: number;
}
export type SearchSkillsArg = {text: string};

export type AddSkillArg = {formData: FormData};

export type UpdateSkillArg = {id: number, formData: FormData};

export type SkillState = {
  editList: SearchSkill[];
  selected: number[];
  creating: boolean;
}