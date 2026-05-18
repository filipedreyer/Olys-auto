import { EntityLink, LinkType } from '../entities/types'

const nowIso = () => new Date().toISOString()
const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

export function createLink(
  links: EntityLink[],
  input: {
    userId: string
    sourceEntityId: string
    targetEntityId: string
    linkType: LinkType
  },
): EntityLink[] {
  if (input.sourceEntityId === input.targetEntityId) {
    return links
  }

  return [
    {
      id: id('link'),
      userId: input.userId,
      sourceEntityId: input.sourceEntityId,
      targetEntityId: input.targetEntityId,
      linkType: input.linkType,
      createdBy: 'user',
      createdAt: nowIso(),
    },
    ...links,
  ]
}

export function removeLink(links: EntityLink[], linkId: string): EntityLink[] {
  return links.map((link) =>
    link.id === linkId
      ? {
          ...link,
          removedAt: nowIso(),
        }
      : link,
  )
}
