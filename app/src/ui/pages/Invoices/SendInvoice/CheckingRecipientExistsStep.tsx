import { useConnectedApp } from '@stores';
import { Card, Loader } from '@ui/common';
import { useEffect, useState } from 'react';
interface Props {
  recipientAddress: string;
  onVerified: () => void;
}

type Result = {
  title: string;
  details: string;
  type: ResultType;
};

const enum ResultType {
  Success = 'SUCCESS',
  Error = 'ERROR'
}

export const CheckingRecipientExistsStep = ({ recipientAddress, onVerified }: Props) => {
  const { solService } = useConnectedApp();

  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    setResult(null);
    solService.checkSolWalletExists(recipientAddress).then((result) => {
      setTimeout(() => {
        if (result) {
          setResult({
            title: 'Success',
            details: `Wallet ${recipientAddress} exists!`,
            type: ResultType.Success
          });
        } else {
          setResult({
            title: 'Error',
            details: `Wallet ${recipientAddress} could not be found.`,
            type: ResultType.Error
          });
        }
      }, 600);
    });
  }, [recipientAddress]);

  useEffect(() => {
    if (result?.type === ResultType.Success) {
      setTimeout(() => {
        onVerified();
      }, 500);
    }
  }, [result]);

  const content = result ? (
    <>
      <Card.Header>
        <h2>{result.title}</h2>
      </Card.Header>
      <Card.Body>
        <p>{result.details}</p>
      </Card.Body>
    </>
  ) : (
    <>
      <Card.Header>
        <h2>Verifying recipient address...</h2>
      </Card.Header>
      <Card.Body>
        <p>This should only take a bit!</p>
        <Loader />
      </Card.Body>
    </>
  );

  return <Card className="shadow-lg bg-gray-800 h-[28rem] w-card">{content}</Card>;
};
