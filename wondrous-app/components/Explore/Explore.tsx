import React, { useState, useCallback } from 'react';
import { useIsMobile } from 'utils/hooks';
import { Button } from 'components/Button';
import MuiButton from '@mui/material/Button';
import { Box, Typography, TextField } from '@mui/material';

import { DaosCube, BountyCone } from 'components/Icons/ExplorePageIcons';
import { useQuery } from '@apollo/client';
import { FILTER_BOUNTIES_TO_EXPLORE } from 'graphql/queries/task';
import palette from 'theme/palette';
import { GRID_MOBILE_STYLES, TABS_LABELS } from 'utils/constants';
import BountySection from 'components/BountySection';
import DaoSection from 'components/DaoSection';
import ExploreFilters from 'components/ExploreFilters';

import styles, {
  BackgroundContainer,
  BackgroundTextWrapper,
  BackgroundTextHeader,
  BackgroundTextSubHeader,
  TabsWrapper,
  Tab,
  IconWrapper,
  BackgroundImg,
  Wheel,
  ExplorePageContentWrapper,
  ExplorePageFooter,
  MetheorSvg,
  PartnershipRequest,
  PartnershipRequestHeader,
  PartnershipRequestSubheader,
} from './styles';
import { OverviewComponent } from '../Wrapper/styles';

const LIMIT = 10;

function ExploreComponent() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(null);
  const [hasMoreBounties, setHasMoreBounties] = useState(true);
  const {
    data: bounties,
    fetchMore,
    refetch,
    variables,
  } = useQuery(FILTER_BOUNTIES_TO_EXPLORE, {
    variables: {
      input: {
        limit: LIMIT,
        offset: 0,
      },
    },
    onCompleted: ({ getTaskExplore }) => {
      if (getTaskExplore.length < LIMIT && hasMoreBounties) setHasMoreBounties(false);
      if (getTaskExplore.length === LIMIT) setHasMoreBounties(true);
    },
  });

  const [openFilters, setOpenFilters] = useState(false);

  const getTaskExploreFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          ...variables.input,
          offset: bounties?.getTaskExplore.length,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMoreBounties(fetchMoreResult?.getTaskExplore?.length >= LIMIT);
        const getTaskExplore = [...prev?.getTaskExplore, ...fetchMoreResult?.getTaskExplore];
        return {
          getTaskExplore,
        };
      },
    }).catch((error) => {
      console.error(error);
    });
  }, [bounties?.getTaskExplore, fetchMore, variables]);

  const filterBounties = useCallback(
    (filters) => {
      refetch({ input: { ...variables.input, limit: LIMIT, offset: 0, ...filters } });
    },
    [refetch, variables]
  );

  const handleTabClick = (key) => {
    if (key === activeTab) {
      return setActiveTab(null);
    }
    return setActiveTab(key);
  };
  const tabs = [
    {
      title: 'Explore DAOs',
      action: () => handleTabClick(TABS_LABELS.DAOS),
      color: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
      hoverColor: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
      key: TABS_LABELS.DAOS,
      rotateDeg: '20deg',
      icon: <DaosCube />,
    },
    {
      title: 'Explore work',
      color: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
      rotateDeg: '-70deg',
      action: () => handleTabClick(TABS_LABELS.BOUNTY),
      iconPseudoStyleWidth: '110%',
      key: TABS_LABELS.BOUNTY,
      icon: <BountyCone />,
      hoverColor: 'linear-gradient(88.88deg, #525252 24.45%, #FFD653 91.22%)',
    },
  ];

  return (
    <OverviewComponent
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <BackgroundContainer style={isMobile ? GRID_MOBILE_STYLES : {}}>
        <BackgroundImg src="/images/explore/explore-page-banner.svg" />
        <Wheel />
        <BackgroundTextWrapper>
          <BackgroundTextHeader>Enter the project wormhole</BackgroundTextHeader>
          <BackgroundTextSubHeader>
            Join your next favorite project and earn crypto by contributing to one of our Partners
          </BackgroundTextSubHeader>
        </BackgroundTextWrapper>
      </BackgroundContainer>
      <Box sx={{ display: 'flex', width: '100%' }}>
        {activeTab === TABS_LABELS.BOUNTY && (
          <ExploreFilters open={openFilters} setOpen={setOpenFilters} updateFilter={filterBounties} />
        )}
        <ExplorePageContentWrapper>
          <TabsWrapper>
            {activeTab === TABS_LABELS.BOUNTY && (
              <MuiButton sx={styles.filterButton} onClick={() => setOpenFilters(!openFilters)}>
                Add filters
              </MuiButton>
            )}
            <Box sx={{ mr: 'auto', ml: activeTab === TABS_LABELS.BOUNTY ? 'none' : 'auto', display: 'flex', gap: 3 }}>
              {tabs.map((tab, idx) => (
                <Tab
                  hoverColor={tab.hoverColor}
                  iconPseudoStyleWidth={tab.iconPseudoStyleWidth}
                  key={tab.key}
                  onClick={tab.action}
                  isActive={activeTab === tab.key}
                  type="button"
                  color={tab.color}
                  rotateDeg={tab.rotateDeg}
                >
                  <span>{tab.title}</span>
                  <IconWrapper>{tab?.icon}</IconWrapper>
                </Tab>
              ))}
            </Box>
          </TabsWrapper>
          {(activeTab === null || activeTab === TABS_LABELS.BOUNTY) && (
            <BountySection
              isMobile={isMobile}
              bounties={bounties?.getTaskExplore}
              fetchMore={getTaskExploreFetchMore}
              hasMore={hasMoreBounties}
            />
          )}
          {(activeTab === null || activeTab === TABS_LABELS.DAOS) && <DaoSection isMobile={isMobile} />}
        </ExplorePageContentWrapper>
      </Box>

      <ExplorePageFooter>
        <BackgroundImg src="/images/explore/explore-page-footer-bg.svg" />
        <MetheorSvg />
        <PartnershipRequest>
          <PartnershipRequestHeader>Become a partner.</PartnershipRequestHeader>
          <PartnershipRequestSubheader>Want your organization to use Wonder?</PartnershipRequestSubheader>
          <Button marginTop="28px">
            <a
              style={{
                textDecoration: 'none',
                color: palette.white,
              }}
              href="https://ffc0pc28hgd.typeform.com/to/txrIA5p1"
              target="_blank"
              rel="noreferrer"
            >
              Sign up here!
            </a>
          </Button>
        </PartnershipRequest>
      </ExplorePageFooter>
    </OverviewComponent>
  );
}

export default ExploreComponent;
