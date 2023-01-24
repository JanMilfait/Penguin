import {AnyAction, createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import * as T from './skillSlice.types';
import { Skill } from '../auth/authSlice.types';
import {MessageResponse} from '../root/rootSlice.types';
// @ts-ignore
import { store } from '../../app/store';
import {SearchSkill} from './skillSlice.types';
import {AuthApi} from '../auth/authSlice';
import { HYDRATE } from 'next-redux-wrapper';


export const SkillApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSkill: builder.query<Skill, T.GetSkillArg>({
      query: ({id}) => '/api/skill/' + id,
      providesTags: (result, error, arg): any =>
        result
          ? [{type: 'Skill', id: arg.id}, 'Skill']
          : ['Skill']
    }),
    searchSkills: builder.query<T.SearchSkill[], T.SearchSkillsArg>({
      query: ({text}) => '/api/skill/search?text=' + text,
      transformResponse: (response: T.SearchSkill[]) => {
        // @ts-ignore
        const editList = store.getState().skill.editList as SearchSkill[];
        return response.filter((skill) => {
          return !editList.find((editSkill) => editSkill.id === skill.id);
        });
      }
    }),
    addSkill: builder.mutation<MessageResponse, T.AddSkillArg>({
      query: ({formData}) => ({
        url: '/api/skill',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: (result, error, arg): any => [{type: 'User', id: arg.formData.get('userId') ?? ''}]
    }),
    updateSkill: builder.mutation<MessageResponse, T.UpdateSkillArg>({
      query: ({id, formData}) => {
        formData.append('_method', 'PUT');
        return ({
          url: '/api/skill/' + formData.get('id') ?? id,
          method: 'POST',
          body: formData
        });
      },
      invalidatesTags: (result, error, arg): any => [{type: 'Skill', id: arg.id}, {type: 'User', id: arg.formData.get('userId') ?? ''}]
    })
  })
});


export const SkillSlice = createSlice({
  name: 'skill',
  initialState: {
    editList: [],
    selected: [],
    creating: false
  } as T.SkillState,
  reducers: {
    addEditSkill: (state, action) => {
      state.editList.push(action.payload);
    },
    addSelected(skillState, action) {
      skillState.selected.push(action.payload);
    },
    removeSelected(skillState, action) {
      skillState.selected = skillState.selected.filter((id) => id !== action.payload);
    },
    setCreatingSkill: (state, action) => {
      state.creating = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: AnyAction) => {
        return {
          ...state,
          ...action.payload.skill
        };
      })
      .addMatcher(AuthApi.endpoints.getUser.matchFulfilled, (state, action) => {
        if ('skills' in action.payload) {
          action.payload.skills.forEach((skill) => {
            const index = state.editList.findIndex((editSkill) => editSkill.id === skill.id);
            if (index === -1) {
              state.editList.push({id: skill.id, name: skill.name, tag: skill.tag, users_count: 0});
              state.selected.push(skill.id);
            } else {
              state.editList[index] = {id: skill.id, name: skill.name, tag: skill.tag, users_count: 0};
            }
          });
        }
      })
      .addMatcher(SkillApi.endpoints.getSkill.matchFulfilled, (state, action) => {
        const index = state.editList.findIndex((editSkill) => editSkill.id === action.payload.id);
        if (index !== -1) {
          state.editList[index] = {id: action.payload.id, name: action.payload.name, tag: action.payload.tag, users_count: 0};
        }
      });
  }
});


export const {
  useGetSkillQuery,
  useSearchSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation
} = SkillApi;

export const {
  addEditSkill,
  addSelected,
  removeSelected,
  setCreatingSkill
} = SkillSlice.actions;


export default SkillSlice.reducer;