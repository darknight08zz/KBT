'use client';

import { useEffect } from 'react';

export default function ConsoleLogger() {
    useEffect(() => {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const styleLog = (args: any[], bg: string, text: string = 'white', icon: string = '📝') => {
            // Only style if the first argument is a string, otherwise it gets messy with objects
            if (typeof args[0] === 'string') {
                return [
                    `%c ${icon} KBT %c ${args[0]}`,
                    `background: ${bg}; color: ${text}; border-radius: 3px; padding: 2px 5px; font-weight: bold;`,
                    'background: transparent; color: inherit; padding-left: 5px;',
                    ...args.slice(1)
                ];
            }
            return args;
        };

        console.log = (...args) => {
            // Avoid styling HMR logs or Next.js internals if possible, but for "all" we try our best
            originalLog.apply(console, styleLog(args, '#2563eb')); // Blue
        };

        console.warn = (...args) => {
            originalWarn.apply(console, styleLog(args, '#eab308', 'black', '⚠️')); // Yellow
        };

        console.error = (...args) => {
            originalError.apply(console, styleLog(args, '#dc2626', 'white', '❌')); // Red
        };

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    return null;
}
