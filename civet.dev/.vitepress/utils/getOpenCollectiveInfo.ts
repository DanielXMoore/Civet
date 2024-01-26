export type OpenCollectiveInfo = Awaited<
  ReturnType<typeof getOpenCollectiveInfo>
>;

type Sponsor = {
  id: number;
  name?: string;
  image?: string;
  href: string;
};

enum TierSlug {
  Backers = 'backers',
  Sponsors = 'sponsors',
}

/**
 * See: https://docs.opencollective.com/help/contributing/development/api/collectives#get-members-per-tier
 */
export async function getOpenCollectiveInfo() {
  const [backers, sponsors] = await Promise.all([
    getTier(TierSlug.Backers),
    getTier(TierSlug.Sponsors),
  ]);

  return { sponsors, backers };
}

async function getTier(tierSlug: TierSlug): Promise<Sponsor[]> {
  const result = await fetch(
    `https://opencollective.com/civet/tiers/${tierSlug}/all.json`
  )
  const json = await result.json()
  return json.map(parseSponsor);
}

function parseSponsor(sponsor: any): Sponsor {
  const { name, image, website, github, twitter, profile, MemberId } = sponsor;
  const href = website ?? github ?? twitter ?? profile ?? '#';
  return {
    href,
    image,
    name: name ?? href,
    id: MemberId,
  };
}
