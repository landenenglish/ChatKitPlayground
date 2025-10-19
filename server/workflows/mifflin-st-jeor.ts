import { z } from 'zod'
import {
  Agent,
  RunContext,
  AgentInputItem,
  Runner,
  withTrace,
} from '@openai/agents'

const GatherUserInputsSchema = z.object({
  weight: z.number(),
  weight_type: z.enum(['kg', 'lbs']),
  height: z.number(),
  height_type: z.enum(['cm', 'in']),
  age: z.number(),
  sex: z.enum(['male', 'female']),
  activity_level: z.enum([
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extra_active',
  ]),
})

const IsFormCompleteSchema = z.object({ complete: z.boolean() })

const gatherUserInputs = new Agent({
  name: 'Gather User Inputs',
  instructions:
    'Gather the user form inputs for the Mifflin-St Jeor Equation. Enter zero or empty values for any missing if they do not provide it.',
  model: 'gpt-4.1',
  outputType: GatherUserInputsSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true,
  },
})

interface IsFormCompleteContext {
  stateMifflinStJeorEquationFormWeight: string
  stateMifflinStJeorEquationFormWeightType: string
  stateMifflinStJeorEquationFormHeight: string
  stateMifflinStJeorEquationFormHeightType: string
  stateMifflinStJeorEquationFormAge: string
  stateMifflinStJeorEquationFormSex: string
  stateMifflinStJeorEquationFormActivityLevel: string
  stateUserHasNotUploadedPhotos: string
}

const isFormCompleteInstructions = (
  runContext: RunContext<IsFormCompleteContext>,
  _agent: Agent<IsFormCompleteContext>
) => {
  const {
    stateMifflinStJeorEquationFormWeight,
    stateMifflinStJeorEquationFormWeightType,
    stateMifflinStJeorEquationFormHeight,
    stateMifflinStJeorEquationFormHeightType,
    stateMifflinStJeorEquationFormAge,
    stateMifflinStJeorEquationFormSex,
    stateMifflinStJeorEquationFormActivityLevel,
    stateUserHasNotUploadedPhotos,
  } = runContext.context
  return `Determine if the form is complete. All of the provided fields must have a valid value. Zero is not acceptable. Not provided is not acceptable.

${stateMifflinStJeorEquationFormWeight} ${stateMifflinStJeorEquationFormWeightType} ${stateMifflinStJeorEquationFormHeight} ${stateMifflinStJeorEquationFormHeightType} ${stateMifflinStJeorEquationFormAge} ${stateMifflinStJeorEquationFormSex} ${stateMifflinStJeorEquationFormActivityLevel} ${stateUserHasNotUploadedPhotos} `
}

const isFormComplete = new Agent({
  name: 'Is Form Complete',
  instructions: isFormCompleteInstructions,
  model: 'gpt-5',
  outputType: IsFormCompleteSchema,
  modelSettings: {
    reasoning: {
      effort: 'low',
      summary: 'auto',
    },
    store: true,
  },
})

interface AgentContext {
  stateMifflinStJeorEquationFormWeight: string
  stateMifflinStJeorEquationFormWeightType: string
  stateMifflinStJeorEquationFormHeight: string
  stateMifflinStJeorEquationFormHeightType: string
  stateMifflinStJeorEquationFormAge: string
  stateMifflinStJeorEquationFormSex: string
  stateMifflinStJeorEquationFormActivityLevel: string
}

const agentInstructions = (
  runContext: RunContext<AgentContext>,
  _agent: Agent<AgentContext>
) => {
  const {
    stateMifflinStJeorEquationFormWeight,
    stateMifflinStJeorEquationFormWeightType,
    stateMifflinStJeorEquationFormHeight,
    stateMifflinStJeorEquationFormHeightType,
    stateMifflinStJeorEquationFormAge,
    stateMifflinStJeorEquationFormSex,
    stateMifflinStJeorEquationFormActivityLevel,
  } = runContext.context
  return `Calculate the Mifflin-St Jeor Equation and give a breakdown ${stateMifflinStJeorEquationFormWeight} ${stateMifflinStJeorEquationFormWeightType} ${stateMifflinStJeorEquationFormHeight} ${stateMifflinStJeorEquationFormHeightType} ${stateMifflinStJeorEquationFormAge} ${stateMifflinStJeorEquationFormSex} ${stateMifflinStJeorEquationFormActivityLevel}`
}

const agent = new Agent({
  name: 'Agent',
  instructions: agentInstructions,
  model: 'gpt-5',
  modelSettings: {
    reasoning: {
      effort: 'low',
      summary: 'auto',
    },
    store: true,
  },
})

interface AgentContext1 {
  stateMifflinStJeorEquationFormWeight: string
  stateMifflinStJeorEquationFormWeightType: string
  stateMifflinStJeorEquationFormHeight: string
  stateMifflinStJeorEquationFormHeightType: string
  stateMifflinStJeorEquationFormAge: string
  stateMifflinStJeorEquationFormSex: string
  stateMifflinStJeorEquationFormActivityLevel: string
}

const agentInstructions1 = (
  runContext: RunContext<AgentContext1>,
  _agent: Agent<AgentContext1>
) => {
  const {
    stateMifflinStJeorEquationFormWeight,
    stateMifflinStJeorEquationFormWeightType,
    stateMifflinStJeorEquationFormHeight,
    stateMifflinStJeorEquationFormHeightType,
    stateMifflinStJeorEquationFormAge,
    stateMifflinStJeorEquationFormSex,
    stateMifflinStJeorEquationFormActivityLevel,
  } = runContext.context
  return `Explain to the user what fields they need to fill out that are missing. Zero or not provided is considered missing.


 ${stateMifflinStJeorEquationFormWeight} ${stateMifflinStJeorEquationFormWeightType} ${stateMifflinStJeorEquationFormHeight} ${stateMifflinStJeorEquationFormHeightType} ${stateMifflinStJeorEquationFormAge} ${stateMifflinStJeorEquationFormSex} ${stateMifflinStJeorEquationFormActivityLevel}`
}

const agent1 = new Agent({
  name: 'Agent',
  instructions: agentInstructions1,
  model: 'gpt-5',
  modelSettings: {
    reasoning: {
      effort: 'low',
      summary: 'auto',
    },
    store: true,
  },
})

type WorkflowInput = { input_as_text: string }

// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace('Mifflin-St Jeor Equation', async () => {
    const state = {
      mifflin_st_jeor_equation_form: {
        weight: null,
        weight_type: '',
        height: null,
        height_type: '',
        age: null,
        sex: '',
        activity_level: '',
      },
      user_has_not_uploaded_photos: true,
      user_has_not_completed_form: true,
      equation: {
        weight: null,
        weight_type: '',
        height: null,
        height_type: '',
        age: null,
        sex: '',
        activity_level: '',
      },
    }

    const conversationHistory: AgentInputItem[] = [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: workflow.input_as_text,
          },
        ],
      },
    ]

    const runner = new Runner({
      traceMetadata: {
        __trace_source__: 'agent-builder',
        workflow_id: 'wf_68f4144ef0f481909c46d2b2f90dfe5907fcad353d1c69cc',
      },
    })

    const gatherUserInputsResultTemp = await runner.run(gatherUserInputs, [
      ...conversationHistory,
    ])

    if (!gatherUserInputsResultTemp.finalOutput) {
      throw new Error('Agent result is undefined')
    }

    const gatherUserInputsResult = {
      output_text: JSON.stringify(gatherUserInputsResultTemp.finalOutput),
      output_parsed: gatherUserInputsResultTemp.finalOutput,
    }

    // Update state with gathered inputs
    state.mifflin_st_jeor_equation_form = gatherUserInputsResult.output_parsed

    const isFormCompleteResultTemp = await runner.run(
      isFormComplete,
      [...conversationHistory],
      {
        context: {
          stateMifflinStJeorEquationFormWeight: String(
            state.mifflin_st_jeor_equation_form.weight || ''
          ),
          stateMifflinStJeorEquationFormWeightType:
            state.mifflin_st_jeor_equation_form.weight_type,
          stateMifflinStJeorEquationFormHeight: String(
            state.mifflin_st_jeor_equation_form.height || ''
          ),
          stateMifflinStJeorEquationFormHeightType:
            state.mifflin_st_jeor_equation_form.height_type,
          stateMifflinStJeorEquationFormAge: String(
            state.mifflin_st_jeor_equation_form.age || ''
          ),
          stateMifflinStJeorEquationFormSex:
            state.mifflin_st_jeor_equation_form.sex,
          stateMifflinStJeorEquationFormActivityLevel:
            state.mifflin_st_jeor_equation_form.activity_level,
          stateUserHasNotUploadedPhotos: String(
            state.user_has_not_uploaded_photos
          ),
        },
      }
    )

    if (!isFormCompleteResultTemp.finalOutput) {
      throw new Error('Agent result is undefined')
    }

    const isFormCompleteResult = {
      output_text: JSON.stringify(isFormCompleteResultTemp.finalOutput),
      output_parsed: isFormCompleteResultTemp.finalOutput,
    }

    state.user_has_not_completed_form =
      isFormCompleteResult.output_parsed.complete == false

    if (state.user_has_not_completed_form == false) {
      const agentResultTemp = await runner.run(
        agent,
        [...conversationHistory],
        {
          context: {
            stateMifflinStJeorEquationFormWeight: String(
              state.mifflin_st_jeor_equation_form.weight || ''
            ),
            stateMifflinStJeorEquationFormWeightType:
              state.mifflin_st_jeor_equation_form.weight_type,
            stateMifflinStJeorEquationFormHeight: String(
              state.mifflin_st_jeor_equation_form.height || ''
            ),
            stateMifflinStJeorEquationFormHeightType:
              state.mifflin_st_jeor_equation_form.height_type,
            stateMifflinStJeorEquationFormAge: String(
              state.mifflin_st_jeor_equation_form.age || ''
            ),
            stateMifflinStJeorEquationFormSex:
              state.mifflin_st_jeor_equation_form.sex,
            stateMifflinStJeorEquationFormActivityLevel:
              state.mifflin_st_jeor_equation_form.activity_level,
          },
        }
      )

      conversationHistory.push(
        ...agentResultTemp.newItems.map((item) => item.rawItem)
      )

      if (!agentResultTemp.finalOutput) {
        throw new Error('Agent result is undefined')
      }

      return {
        output_text: agentResultTemp.finalOutput ?? '',
      }
    } else {
      const agentResultTemp = await runner.run(
        agent1,
        [...conversationHistory],
        {
          context: {
            stateMifflinStJeorEquationFormWeight: String(
              state.mifflin_st_jeor_equation_form.weight || ''
            ),
            stateMifflinStJeorEquationFormWeightType:
              state.mifflin_st_jeor_equation_form.weight_type,
            stateMifflinStJeorEquationFormHeight: String(
              state.mifflin_st_jeor_equation_form.height || ''
            ),
            stateMifflinStJeorEquationFormHeightType:
              state.mifflin_st_jeor_equation_form.height_type,
            stateMifflinStJeorEquationFormAge: String(
              state.mifflin_st_jeor_equation_form.age || ''
            ),
            stateMifflinStJeorEquationFormSex:
              state.mifflin_st_jeor_equation_form.sex,
            stateMifflinStJeorEquationFormActivityLevel:
              state.mifflin_st_jeor_equation_form.activity_level,
          },
        }
      )

      conversationHistory.push(
        ...agentResultTemp.newItems.map((item) => item.rawItem)
      )

      if (!agentResultTemp.finalOutput) {
        throw new Error('Agent result is undefined')
      }

      return {
        output_text: agentResultTemp.finalOutput ?? '',
      }
    }
  })
}
