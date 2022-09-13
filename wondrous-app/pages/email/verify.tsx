import React, { useEffect, useState } from 'react';

import { JoinWaitlistHeader, ProfileWrapper, ProfileCenteredDiv } from 'components/profile/email/styles';

import { ErrorText } from 'components/Common';
import { useIsMobile, useWindowSize } from 'utils/hooks';
import { Logo } from 'components/Common/ci';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { CONFIRM_EMAIL_ADDRESS } from 'graphql/mutations';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { CircularProgress } from '@mui/material';

function EmailVerify() {
  const router = useRouter();
  const [verificationError, setVerificationError] = useState(null);
  const { token, userid } = router.query; // it's userid here instead of userId since it'f from the redirect
  const [loading, setLoading] = useState(true);
  const [verifyEmail, { data, error }] = useMutation(CONFIRM_EMAIL_ADDRESS, {
    onError: (error) => {
      if (error?.graphQLErrors[0].extensions.code === 400) {
        setVerificationError(true);
      }
    },
  });
  const emailAddressConfirm = data?.confirmEmailAddress?.success;
  const errorVerifying = error?.graphQLErrors[0].extensions.code === 400;

  useEffect(() => {
    if (token && loading && userid) {
      verifyEmail({
        variables: {
          token,
          userId: userid,
        },
      });
    }
  }, [token, verifyEmail, loading, userid]);

  useEffect(() => {
    if (emailAddressConfirm) {
      setLoading(false);
    }
  }, [emailAddressConfirm]);

  return (
    <ProfileWrapper>
      <ProfileCenteredDiv>
        <Logo />
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {emailAddressConfirm && (
              <>
                <JoinWaitlistHeader variant="h3">Thanks for confirming your email!</JoinWaitlistHeader>
                <CreateFormPreviewButton
                  onClick={() => {
                    router.push('/login', undefined, {
                      shallow: true,
                    });
                  }}
                >
                  Log In
                </CreateFormPreviewButton>
              </>
            )}
          </>
        )}
        {verificationError && <ErrorText>Problem verifying your email please sign in and try again</ErrorText>}
      </ProfileCenteredDiv>
    </ProfileWrapper>
  );
}

export default EmailVerify;
