import React from 'react'
import PropTypes from 'prop-types'
import { Models } from '../../config/index.mjs'
import { apiModeToModelName, isApiModeSelected, modelNameToDesc } from '../../utils'

const SelectModel = ({
  apiModes,
  session,
  config,
  conversationItemData,
  getRetryFn,
  t,
  setSession,
  notClampSize,
}) => {
  return (
    <select
      style={notClampSize ? {} : { width: 0, flexGrow: 1 }}
      className="normal-button"
      required
      onChange={(e) => {
        let apiMode = null
        let modelName = 'customModel'
        if (e.target.value !== '-1') {
          apiMode = apiModes[e.target.value]
          modelName = apiModeToModelName(apiMode)
        }
        const newSession = {
          ...session,
          modelName,
          apiMode,
          aiName: modelNameToDesc(
            apiMode ? apiModeToModelName(apiMode) : modelName,
            t,
            config.customModelName,
          ),
        }
        if (config.autoRegenAfterSwitchModel && conversationItemData.length > 0)
          getRetryFn(newSession)()
        else setSession(newSession)
      }}
    >
      {apiModes.map((apiMode, index) => {
        const modelName = apiModeToModelName(apiMode)
        const desc = modelNameToDesc(modelName, t, config.customModelName)
        if (desc) {
          return (
            <option value={index} key={index} selected={isApiModeSelected(apiMode, session)}>
              {desc}
            </option>
          )
        }
      })}
      <option value={-1} selected={!session.apiMode && session.modelName === 'customModel'}>
        {t(Models.customModel.desc)}
      </option>
    </select>
  )
}

SelectModel.propTypes = {
  apiModes: PropTypes.array.isRequired,
  session: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  conversationItemData: PropTypes.array.isRequired,
  getRetryFn: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  setSession: PropTypes.func.isRequired,
  notClampSize: PropTypes.bool,
}

export default SelectModel
