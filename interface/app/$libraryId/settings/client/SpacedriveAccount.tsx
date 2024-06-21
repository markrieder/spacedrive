import { auth, useBridgeQuery } from '@sd/client';
import { Button, Card } from '@sd/ui';
import { AuthRequiredOverlay } from '~/components/AuthRequiredOverlay';
import { useLocale } from '~/hooks';

export function SpacedriveAccount() {
	const authState = auth.useStateSnapshot();
	const me = useBridgeQuery(['auth.me'], { retry: false });

	if (authState.status === 'loggedIn') {
		me.refetch();
	}

	return (
		<Card className="relative">
			<AuthRequiredOverlay />
			<Account data={me.data!} />
		</Card>
	);
}

function Account(props: { data: { id: string; email: string } }) {
	const { t } = useLocale();

	return (
		<div className="my-2 flex w-full flex-col">
			<div className="flex items-center justify-between">
				<span className="font-semibold">{t('spacedrive_account')}</span>
				<Button variant="gray" onClick={auth.logout}>
					{t('logout')}
				</Button>
			</div>
			<hr className="mb-4 mt-2 w-full border-app-line" />
			<span>{t('logged_in_as', { email: props.data.email })}</span>
		</div>
	);
}
