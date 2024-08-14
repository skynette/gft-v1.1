'use client'

import SettingsForm from "./components/settingsForm"

export default function SettingsPage() {
    return (
        <div className="flex flex-col">
            <main className="flex bg-muted/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="max-w-6xl w-full grid gap-2">
                    <h1 className="font-semibold text-3xl">Configuration Settings</h1>
                    <p className="text-muted-foreground">Manage Platform settings and preferences.</p>
                </div>
                <div className="max-w-4xl w-full">
                    <SettingsForm />
                </div>
            </main>
        </div>
    )
}