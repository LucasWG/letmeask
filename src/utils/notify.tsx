import toast from 'react-hot-toast'

export const notify = (type: 'error' | 'success', message: string) => toast[type](message)
