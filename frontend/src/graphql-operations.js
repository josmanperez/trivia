import gql from "graphql-tag";

export const FIND_CATEGORIES = gql`
    query FindCategories {
        categories {
            title
          }
    }
`;

export const FIND_QUESTIONS = gql`
    query FindQuestions($query: QuestionQueryInput!) {
        questions(query: $query) {
            _id
            correct_answer
            question
            incorrect_answers
          }
    }
`;

export const FIND_RANKING = gql`
    query SortedRanking {
        RankingSorted {
            _id
            winRate
            totalTime
            totalGames
            user {
              email
              name
            }
          }
    }
`;

export const UPDATE_GAME = gql`
    mutation updateOneUser($query: UserQueryInput, $set: UserUpdateInput!) {
        updateOneUser(query: $query, set: $set) {
            _id
          }
    }
`;