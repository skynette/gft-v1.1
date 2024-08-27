
type BrowserUsageResponse = {
    browsers: Browser[]
}

type Browser = {
    name: string
    icon: string
    usage: number
    change: number
    color: string
}