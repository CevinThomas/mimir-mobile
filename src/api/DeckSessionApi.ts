import axiosInstance from './AxiosConfig'

export const createDeckSession = async (idOfDeck: string) => {
  const response = await axiosInstance.post('/deck_sessions', { deck_id: idOfDeck })
  return response.data
}

export const archiveCard = async (deckSessionId: string, idOfCard: string) => {
  const response = await axiosInstance.post(
    `/deck_sessions/${deckSessionId}/exclude_card?card_id=${idOfCard}`
  )
  return response.data
}

export const getCardBatch = async (deckSessionId: string) => {
  const response = await axiosInstance.get(`/deck_sessions/${deckSessionId}/cards`)
  return response.data
}

export const getDeckSessions = async () => {
  const response = await axiosInstance.get('/deck_sessions')
  return response.data
}

export const copyDeck = async (deckId: string) => {
  return await axiosInstance.post(`/deck_sessions/${deckId}/copy`)
}

export const getDeckSession = async (deckSessionId: string) => {
  const response = await axiosInstance.get(`/deck_sessions/${deckSessionId}`)
  return response.data
}

export const resetDeckSession = async (deckSessionId: string) => {
  const response = await axiosInstance.delete(`/deck_sessions/${deckSessionId}/reset_session`)
}

export const deleteDeckSession = async (deckSessionId: string) => {
  const response = await axiosInstance.delete(`/deck_sessions/${deckSessionId}`)
  return response.data
}

export const answerCardApi = async (sessionId: string, cardId: string, choiceId: string) => {
  const response = await axiosInstance.post(`/deck_sessions/${sessionId}/answer_question`, {
    choice_id: choiceId,
    card_id: cardId
  })
  return response.data
}

export const completeDeckSession = async (deckSessionId: string) => {
  const response = await axiosInstance.post(`/deck_sessions/${deckSessionId}/complete`)
  return response.data
}
