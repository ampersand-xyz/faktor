import {AnchorWallet} from "@solana/wallet-adapter-react"

export interface InvoicesViewProps {
	wallet: AnchorWallet
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ wallet }) => {
	return (
		<div>
			INVOICES
		</div>
	)
}
