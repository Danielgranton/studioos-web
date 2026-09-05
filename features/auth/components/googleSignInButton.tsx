"use client";

export function GoogleSignInButton() {
    function continueWithGoogle() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;
        window.location.assign(`${apiUrl}/auth/oauth2/google`);
    }

    return <button type="button" onClick={continueWithGoogle} className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[#3f3f3f] bg-[#181818] text-sm font-medium text-[#ddd] transition hover:border-[#666] hover:bg-[#202020] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff]">
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" role="img">
            <path fill="#4285F4" d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z" />
            <path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.6Z" />
            <path fill="#FBBC05" d="M6.53 13.7A5.85 5.85 0 0 1 6.22 12c0-.59.11-1.17.31-1.7V7.77H3.29A9.6 9.6 0 0 0 2.25 12c0 1.53.37 2.98 1.04 4.23l3.24-2.53Z" />
            <path fill="#EA4335" d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.71 5.37l3.24 2.53C7.3 7.99 9.46 6.27 12 6.27Z" />
        </svg>
        Continue with Google
    </button>;
}
