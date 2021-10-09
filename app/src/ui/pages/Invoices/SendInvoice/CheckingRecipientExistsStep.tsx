import { useConnectedApp } from '@stores';
import { Card, Loader, SecondaryAction } from '@ui/common';
import { useEffect, useState } from 'react';
interface Props {
  recipientAddress: string;
  onVerified: () => void;
  onGoBack: () => void;
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

const TIMEOUT_DURATION = 1000;

export const CheckingRecipientExistsStep = ({ recipientAddress, onVerified, onGoBack }: Props) => {
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
      }, TIMEOUT_DURATION);
    });
  }, [recipientAddress]);

  useEffect(() => {
    if (result?.type === ResultType.Success) {
      setTimeout(() => {
        onVerified();
      }, TIMEOUT_DURATION);
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
      {result.type === ResultType.Error && (
        <Card.Footer>
          <SecondaryAction className="w-full" onClick={onGoBack}>
            Back
          </SecondaryAction>
        </Card.Footer>
      )}
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

  return <Card className="shadow-lg bg-gray-800 h-card w-card">{content}</Card>;
};
