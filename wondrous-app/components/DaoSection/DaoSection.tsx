import OrgItem from 'components/OrgItem';
import Masonry from '@mui/lab/Masonry';

import { FeaturedList, gridMobileStyles } from 'utils/constants';

import { OrgsSectionHeader, SectionSubheader, SectionWrapper } from './styles';

const DaoSection = ({ isMobile }) => (
  <SectionWrapper>
    <OrgsSectionHeader>Our Alpha Partners</OrgsSectionHeader>
    <SectionSubheader>Work with the best DAO partners in the space.</SectionSubheader>
    <Masonry spacing={3} columns={{ xs: 1, sm: 2, md: 2, lg: 3 }} style={isMobile ? gridMobileStyles : {}}>
      {FeaturedList.map((org, index) => (
        <OrgItem key={index} org={org} />
      ))}
    </Masonry>
  </SectionWrapper>
);

export default DaoSection;
