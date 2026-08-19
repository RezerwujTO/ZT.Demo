export interface Typewriter {
  type: (text: string, apply: (value: string) => void, options?: { speed?: number; startDelay?: number }) => Promise<boolean>
  stop: () => void
}

export function createTypewriter(): Typewriter {
  let token = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  const stop = () => {
    token += 1
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const type = (text: string, apply: (value: string) => void, options: { speed?: number; startDelay?: number } = {}) =>
    new Promise<boolean>(resolve => {
      token += 1
      const current = token
      const speed = options.speed ?? 60
      let index = 0

      const step = () => {
        if (current !== token) {
          resolve(false)
          return
        }
        index += 1
        apply(text.slice(0, index))
        if (index >= text.length) {
          resolve(true)
          return
        }
        timer = setTimeout(step, speed + Math.random() * 45)
      }

      timer = setTimeout(step, options.startDelay ?? 350)
    })

  return { type, stop }
}

export const demoCredentials = {
  email: 'demo@zarezerwujto.pl',
  password: 'demo1234',
  salonName: 'Studio Vibe — fryzjer & beauty',
  phone: '+48 22 118 44 20',
  city: 'Warszawa',
}
