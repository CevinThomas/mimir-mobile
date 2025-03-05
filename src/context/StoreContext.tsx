import React, { createContext, useContext, useReducer } from 'react'

type Choice = {
  id?: string
  title: string
  correct: boolean
}

type Card = {
  id?: string
  title: string
  explanation: string
  choices: Choice[]
}

type Deck = {
  name: string
  description: string
  active: boolean
  id?: string
  cards: Card[]
}

type InitialState = Deck & {
  currentCard: Card
  name: string
  description: string
  id: string
  active: boolean
  cards: Card[]
  folder_ids?: string[]
  account: any
  isLoggedIn: boolean
}

const StoreContext = createContext()

const initialState: InitialState = {
  account: {},
  isLoggedIn: false,
  currentCard: {
    title: '',
    explanation: '',
    choices: [
      { title: '', correct: true },
      { title: '', correct: false },
      { title: '', correct: false },
      { title: '', correct: false }
    ]
  },
  name: '',
  description: '',
  id: '',
  active: false,
  cards: [],
  folder_ids: []
}

const storeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.payload
      }
    case 'LOG_IN':
      return {
        ...state,
        isLoggedIn: true
      }
    case 'LOG_OUT':
      return {
        ...state,
        isLoggedIn: false
      }
    case 'SET_DECK':
      return {
        ...state,
        name: action.response.name,
        description: action.response.description,
        id: action.response.id,
        cards: action.response.cards || [],
        active: action.response.active || false
      }
    case 'UPDATE_DECK_KEY':
      return { ...state, [action.key]: action.value }

    case 'REMOVE_FOLDER_ID':
      return { ...state, folder_ids: state.folder_ids.filter((id) => id !== action.id) }

    case 'ADD_FOLDER_ID':
      return { ...state, folder_ids: [...state.folder_ids, action.id] }

    case 'CLEAR_CURRENT_CARD':
      return { ...state, currentCard: initialState.currentCard }

    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.card }

    case 'UPDATE_CURRENT_CARD':
      return { ...state, currentCard: { ...state.currentCard, [action.key]: action.value } }

    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.card],
        currentCard: action.card
      }

    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map((card) => (card.id === action.card.id ? action.card : card))
      }

    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== state.currentCard.id)
      }

    case 'RESET':
      return initialState

    case 'UPDATE_CHOICE':
      const choiceToUpdate = state.currentCard.choices[action.index]
      const updatedChoice = { ...choiceToUpdate, title: action.text }

      return {
        ...state,
        currentCard: {
          ...state.currentCard,
          choices: state.currentCard.choices.map((choice, index) =>
            index === action.index ? updatedChoice : choice
          )
        }
      }
    default:
      return state
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export const useStoreContext = () => useContext(StoreContext)
