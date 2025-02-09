import axiosInstance from './AxiosConfig'

export const getDecks = async () => {
  const response = await axiosInstance.get('/decks')
  return response.data
}

export const shareDeck = async (deckId: string, userIds: string[]) => {
  return await axiosInstance.post(`/decks/${deckId}/share`, { user_ids: userIds })
}

export const getSharedDecks = async () => {
  const response = await axiosInstance.get('/decks/shared')
  return response.data
}

export const getAccountDecks = async () => {
  const response = await axiosInstance.get('/decks/account_decks')
  return response.data
}

export const createDeck = async (deck: any) => {
  const response = await axiosInstance.post('/decks', {
    deck: deck
  })
  return response.data
}

export const getDeck = async (deckId: string) => {
  const response = await axiosInstance.get(`/decks/${deckId}`)
  return response.data
}

export const getEligibleShareUsers = async (deckId: string) => {
  const response = await axiosInstance.get(`/decks/${deckId}/share_with`)
  return response.data
}

export const removeSharedDeck = async (deckId: string) => {
  return await axiosInstance.delete(`/decks/${deckId}/shared_session`)
}

export const createPromoteRequest = async (deckId: string) => {
  return await axiosInstance.post(`/decks/${deckId}/request_promote`)
}
