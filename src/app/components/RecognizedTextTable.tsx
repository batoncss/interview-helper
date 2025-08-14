type Props = {
    finalText: string[],
}

export default function RecognizedTextTable({finalText}: Props) {
    return (
        <>
            {finalText.length === 0 ? (
                <span className="text-gray-400 italic">Говорите…</span>
            ) : (
                finalText.map((text, index) => (
                    <div
                        key={index}
                        className={`border-b pb-1 ${text.includes('(не отправлено)') ? 'text-gray-400' : 'text-gray-800'}`}
                    >
                        {text}
                    </div>
                ))
            )
            }
        </>
    );
}