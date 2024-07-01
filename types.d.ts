export interface Session {
    user: User
    accessToken: string
  }
  
  export interface User {
    id?: string
    name: string
    email: string
    firstName?: string
    lastName?: string
    image: string
    picture?: string
  }
  