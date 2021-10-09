import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
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

const SUCCESS_RESULT = {
  title: 'Success',
  details: `Wallet exists!`,
  type: ResultType.Success
};
const ERROR_RESULT = {
  title: 'Error',
  details: `Wallet could not be found.`,
  type: ResultType.Error
};

const ICONS = {
  [ResultType.Success]: <CheckCircleIcon className="text-green-500 h-24" />,
  [ResultType.Error]: <ExclamationCircleIcon className="text-red-600 h-24" />
};
export const CheckingRecipientExistsStep = ({ recipientAddress, onVerified, onGoBack }: Props) => {
  const { solService } = useConnectedApp();

  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    setResult(null);
    solService.checkSolWalletExists(recipientAddress).then((result) => {
      setTimeout(() => {
        if (result) {
          setResult(SUCCESS_RESULT);
        } else {
          setResult(ERROR_RESULT);
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
        <div className="flex flex-col items-center gap-6">
          {ICONS[result.type]}
          <h2 className="text-center text-3xl">{result.title}</h2>
        </div>
      </Card.Header>
      <Card.Body>
        <p className="text-xl text-center">{result.details}</p>
      </Card.Body>
      {result.type === ResultType.Success && (
        <div>
          <Loader />
        </div>
      )}
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

  return <Card className={`shadow-lg bg-gray-800 h-card w-card`}>{content}</Card>;
};
