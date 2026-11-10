interface Contact {
   name: string
   url: string
}

declare module '#app' {
   interface NuxtPublicConfig {
      contacts: Contact[]
   }
}

export { }