import React, { useEffect, useState } from 'react'


export function ToggleSwitch() {
    const [checked, setChecked] = useState(true)
    useEffect(() => {
        const mode = localStorage.getItem("cluster")
        if (!mode) {
            localStorage.setItem("cluster", "mainnet-beta")
            setChecked(true)
        } else {
            if (mode.includes("devnet")) {
                setChecked(false)
            }
        }
    }, [checked])
    return (
        <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-white mb-1">
                {checked ? 'Mainnet' : 'Devnet'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={() => {
                        const cluster = "mainnet-beta"
                        const m = localStorage.getItem("cluster")
                        if (m == null || m != cluster) {
                            localStorage.setItem("cluster", "mainnet-beta")
                            setChecked(true)

                        } else {
                            localStorage.setItem("cluster", "devnet")
                            setChecked(false)
                        }
                        window.location.reload()
                    }}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
            </label>
        </div>
    )
}

