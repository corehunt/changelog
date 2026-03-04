import { THEME } from '@/lib/theme';

export function DisclaimerBanner() {
    return (
        <div
            className="border-t px-6 md:px-12 lg:px-16 py-4 text-xs"
            style={{
                backgroundColor: `${THEME.colors.background.primary}F0`,
                borderColor: THEME.colors.border.hairline,
                color: THEME.colors.text.secondary,
            }}
        >
            <div className="max-w-3xl mx-auto leading-relaxed text-center opacity-70">
                <p className="text-left">
                    <strong className="font-medium">Disclaimer:</strong> This site is a personal
                    engineering log maintained in real time. Content reflects my own work,
                    experiments, and opinions and does not represent my employer, past or present.
                    Examples are generalized and anonymized, and no proprietary or confidential
                    information is shared. Entries may evolve as understanding develops.
                </p>
            </div>
        </div>
    );
}