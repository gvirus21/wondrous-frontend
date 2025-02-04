import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
  GET_DISCORD_GUILD_FROM_INVITE_CODE,
  CHECK_DISCORD_BOT_ADDED,
  GET_CHANNELS_FROM_DISCORD,
} from 'graphql/queries';
import { MANUAL_DISCORD_ORG_SETUP } from 'graphql/mutations';

import { BOT_URL } from 'components/DiscordNotificationSetup';
import palette from 'theme/palette';
import InputForm from 'components/Common/InputForm/inputForm';
import DropdownSelect from 'components/Common/DropdownSelect';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { ErrorText } from 'components/Common';
import { AddGuildButton, DiscordText } from 'components/Settings/styles';
import { DiscordCard, DiscordCardElement, DiscordCardElementDiv } from './styles';

let timeout;

function AddWonderBotToDiscordConfig({ orgId }) {
  const [discordInviteLink, setDiscordInviteLink] = useState('');
  const [discordInviteLinkError, setDiscordInviteLinkError] = useState('');
  const [getDiscordGuildFromInviteCode] = useLazyQuery(GET_DISCORD_GUILD_FROM_INVITE_CODE);
  const [manualDiscordOrgSetup, { error: saveDiscordOrgError }] = useMutation(MANUAL_DISCORD_ORG_SETUP);
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [checkDiscordBotAdded, { data: discordBotAdded, startPolling, stopPolling }] = useLazyQuery(
    CHECK_DISCORD_BOT_ADDED,
    {
      variables: {
        guildId,
      },
    }
  );

  useEffect(() => {
    if (guildId) {
      checkDiscordBotAdded({
        variables: {
          guildId,
        },
      });
      startPolling(1000);
    }
  }, [guildId]);

  useEffect(() => {
    if (discordBotAdded?.checkDiscordBotAdded?.botAdded) {
      // #fetch channels
      getChannelsFromDiscord({
        variables: {
          guildId,
        },
      });
      stopPolling();
    }
  }, [discordBotAdded]);

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const inviteCodeArr = discordInviteLink.split('/');
      const inviteCode = inviteCodeArr[inviteCodeArr.length - 1];
      if (discordInviteLink) {
        if (inviteCode) {
          try {
            const guildData = await getDiscordGuildFromInviteCode({
              variables: {
                inviteCode,
              },
            });
            if (guildData?.error) {
              setDiscordInviteLinkError('Invalid invite link');
            } else if (guildData?.data) {
              setGuildId(guildData?.data?.getDiscordGuildFromInviteCode?.guildId);
            }
          } catch (err) {
            console.log('err', err);
            setDiscordInviteLinkError('Invalid invite link');
          }
        } else {
          setDiscordInviteLinkError('Invalid invite link');
        }
      }
    }, 1000);
  }, [discordInviteLink]);
  const discordChannels = discordChannelData?.getAvailableChannelsForDiscordGuild || [];
  const filteredDiscordChannels = discordChannels.map((channel) => ({
    value: channel.id,
    label: channel.name,
  }));

  return (
    <>
      <DiscordCard container spacing={2}>
        <DiscordCardElement sm={4}>
          <DiscordCardElementDiv>
            <DiscordText>1. Paste invite link</DiscordText>
            <InputForm
              style={{
                background: palette.grey1000,
              }}
              value={discordInviteLink}
              onChange={(e) => setDiscordInviteLink(e.target.value)}
            />
            {!!discordInviteLinkError && <ErrorText>{discordInviteLinkError}</ErrorText>}
          </DiscordCardElementDiv>
        </DiscordCardElement>
        <DiscordCardElement sm={4}>
          <DiscordCardElementDiv>
            <DiscordText>2. Add bot</DiscordText>
            {guildId && !discordBotAdded?.checkDiscordBotAdded?.botAdded ? (
              <AddGuildButton
                style={{
                  border: '1px solid deepskyblue',
                  backgroundColor: palette.grey1000,
                }}
                href={`${BOT_URL}&guild_id=${guildId}`}
                target="_blank"
              >
                <DiscordText
                  style={{
                    color: palette.white,
                    fontSize: '14px',
                    marginBottom: '0',
                  }}
                >
                  Add Wonder bot
                </DiscordText>
              </AddGuildButton>
            ) : (
              <AddGuildButton disabled>
                <DiscordText
                  style={{
                    color: '#8b8b8c',
                    fontSize: '14px',
                    marginBottom: '0',
                  }}
                >
                  {discordBotAdded?.checkDiscordBotAdded?.botAdded ? 'Wonder bot added' : 'Add Wonder bot'}
                </DiscordText>
              </AddGuildButton>
            )}
          </DiscordCardElementDiv>
        </DiscordCardElement>
        <DiscordCardElement sm={4}>
          <DiscordCardElementDiv>
            <DiscordText>3. Set channel</DiscordText>
            <DropdownSelect
              value={selectedChannel}
              setValue={setSelectedChannel}
              formSelectStyle={{
                height: 'auto',
              }}
              innerStyle={{
                marginTop: '0',
                background: palette.grey1000,
              }}
              options={filteredDiscordChannels}
            />
          </DiscordCardElementDiv>
        </DiscordCardElement>
      </DiscordCard>
      {selectedChannel && (
        <>
          <CreateFormPreviewButton
            style={{
              float: 'right',
              marginTop: '24px',
            }}
            onClick={() => {
              manualDiscordOrgSetup({
                variables: {
                  guildId,
                  orgId,
                  channelId: selectedChannel,
                },
                refetchQueries: [GET_ORG_DISCORD_NOTIFICATION_CONFIGS],
              });
            }}
          >
            Save changes
          </CreateFormPreviewButton>
          {saveDiscordOrgError && (
            <ErrorText>
              Failed to set up Discord for organization: {saveDiscordOrgError?.message || saveDiscordOrgError}
            </ErrorText>
          )}
        </>
      )}
    </>
  );
}

export default AddWonderBotToDiscordConfig;
