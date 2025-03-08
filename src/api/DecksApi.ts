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

export const updateDeck = async (deckId: string, deck: any) => {
  return await axiosInstance.put(`/decks/${deckId}`, { deck: deck })
}

export const createCard = async (deckId: string, card: any) => {
  return await axiosInstance.post(`/decks/${deckId}/cards`, { card: card })
}

export const updateCard = async (deckId: string, cardId: string, card: any) => {
  return await axiosInstance.put(`/decks/${deckId}/cards/${cardId}`, { card: card })
}

export const deleteCard = async (deckId: string, cardId: string) => {
  return await axiosInstance.delete(`/decks/${deckId}/cards/${cardId}`)
}

export const updateChoice = async (
  deckId: string,
  cardId: string,
  choiceId: string,
  choice: any
) => {
  return await axiosInstance.put(`/decks/${deckId}/cards/${cardId}/choices/${choiceId}`, {
    choice: choice
  })
}

export const createChoice = async (deckId: string, cardId: string, choice: any) => {
  return await axiosInstance.post(`/decks/${deckId}/cards/${cardId}/choices`, { choice: choice })
}

export const deleteChoice = async (deckId: string, cardId: string, choiceId: string) => {
  return await axiosInstance.delete(`/decks/${deckId}/cards/${cardId}/choices/${choiceId}`)
}

export const getDeck = async (deckId: string) => {
  const response = await axiosInstance.get(`/decks/${deckId}`)
  return response.data
}

export const getNewDecks = async () => {
  const response = await axiosInstance.get('/decks/new_decks')
  return response.data
}

export const viewedAccountDecks = async (deckId: string) => {
  return await axiosInstance.patch(`/decks/${deckId}/viewed_account_decks`)
}

export const checkedAccountDecks = async () => {
  return await axiosInstance.patch('/decks/checked')
}

export const getFeaturedDecks = async () => {
  const response = await axiosInstance.get('/decks/featured')
  return response.data
}

export const removeFeaturedDeck = async (deckId: string) => {
  return await axiosInstance.delete(`/decks/${deckId}/remove_featured`)
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

export const favoriteDeck = async (deckId: string) => {
  return await axiosInstance.post(`/decks/${deckId}/favorite`)
}

export const deleteDeck = async (deckId: string) => {
  return await axiosInstance.delete(`/decks/${deckId}`)
}
