import path from 'node:path'
import { type IpcContext, IpcMethod, IpcService } from 'electron-ipc-decorator'
import type {
  SubscriptionCreatePayload,
  SubscriptionResolvedFeed,
  SubscriptionRule,
  SubscriptionUpdatePayload
} from '../../../shared/types'
import {
  DEFAULT_SUBSCRIPTION_FILENAME_TEMPLATE,
  SUBSCRIPTION_DUPLICATE_FEED_ERROR
} from '../../../shared/types'
import { sanitizeFilenameTemplate } from '../../download-engine/args-builder'
import { resolveFeedFromInput } from '../../lib/subscription-feed-resolver'
import { subscriptionManager } from '../../lib/subscription-manager'
import { subscriptionScheduler } from '../../lib/subscription-scheduler'
import { settingsManager } from '../../settings'

interface CreateSubscriptionOptions {
  url: string
  keywords?: string[]
  tags?: string[]
  onlyDownloadLatest?: boolean
  downloadDirectory?: string
  namingTemplate?: string
  enabled?: boolean
}

class SubscriptionService extends IpcService {
  static readonly groupName = 'subscriptions'

  @IpcMethod()
  list(_context: IpcContext): SubscriptionRule[] {
    return subscriptionManager.getAll()
  }

  @IpcMethod()
  resolve(_context: IpcContext, url: string): SubscriptionResolvedFeed {
    return resolveFeedFromInput(url)
  }

  @IpcMethod()
  async create(
    _context: IpcContext,
    options: CreateSubscriptionOptions
  ): Promise<SubscriptionRule> {
    const resolved = resolveFeedFromInput(options.url)
    const duplicate = subscriptionManager.findDuplicateFeed(resolved.feedUrl)
    if (duplicate) {
      throw new Error(SUBSCRIPTION_DUPLICATE_FEED_ERROR)
    }
    const settings = settingsManager.getAll()
    const defaultDownloadDirectory = path.join(settings.downloadPath, 'Subscriptions')
    const payload: SubscriptionCreatePayload = {
      sourceUrl: resolved.sourceUrl,
      feedUrl: resolved.feedUrl,
      platform: resolved.platform,
      keywords: options.keywords,
      tags: options.tags,
      onlyDownloadLatest:
        options.onlyDownloadLatest ?? settings.subscriptionOnlyLatestDefault ?? true,
      downloadDirectory: options.downloadDirectory || defaultDownloadDirectory,
      namingTemplate: sanitizeFilenameTemplate(
        options.namingTemplate || DEFAULT_SUBSCRIPTION_FILENAME_TEMPLATE
      ),
      enabled: options.enabled ?? true
    }

    const created = subscriptionManager.add(payload)
    void subscriptionScheduler.runNow(created.id)
    return created
  }

  @IpcMethod()
  update(
    _context: IpcContext,
    id: string,
    updates: SubscriptionUpdatePayload
  ): SubscriptionRule | undefined {
    if (updates.feedUrl) {
      const duplicate = subscriptionManager.findDuplicateFeed(updates.feedUrl, id)
      if (duplicate) {
        throw new Error(SUBSCRIPTION_DUPLICATE_FEED_ERROR)
      }
    }
    const normalized: SubscriptionUpdatePayload = { ...updates }
    if (typeof normalized.namingTemplate === 'string') {
      normalized.namingTemplate = sanitizeFilenameTemplate(normalized.namingTemplate)
    }
    return subscriptionManager.update(id, normalized)
  }

  @IpcMethod()
  remove(_context: IpcContext, id: string): boolean {
    return subscriptionManager.remove(id)
  }

  @IpcMethod()
  async refresh(_context: IpcContext, id?: string): Promise<void> {
    await subscriptionScheduler.runNow(id)
  }

  @IpcMethod()
  async queueItem(_context: IpcContext, id: string, itemId: string): Promise<boolean> {
    return subscriptionScheduler.queueItem(id, itemId)
  }
}

export { SubscriptionService }
