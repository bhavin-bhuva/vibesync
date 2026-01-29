import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { FriendService } from '../services/friend.service';

export class FriendController {
  private friendService: FriendService;

  constructor() {
    this.friendService = new FriendService();
  }

  /**
   * POST /api/v1/friends/request
   * Send a friend request by friend code
   */
  async sendFriendRequest(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { friendCode } = req.body;

      const result = await this.friendService.sendFriendRequest(userId, friendCode);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Friend request sent successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to send friend request',
        },
      });
    }
  }

  /**
   * GET /api/v1/friends/requests
   * Get all pending friend requests
   */
  async getPendingRequests(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const requests = await this.friendService.getPendingRequests(userId);

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch friend requests',
        },
      });
    }
  }

  /**
   * PUT /api/v1/friends/request/:id/accept
   * Accept a friend request
   */
  async acceptFriendRequest(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const requestId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (isNaN(requestId)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request ID' },
        });
      }

      await this.friendService.acceptFriendRequest(requestId, userId);

      res.status(200).json({
        success: true,
        message: 'Friend request accepted',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to accept friend request',
        },
      });
    }
  }

  /**
   * PUT /api/v1/friends/request/:id/decline
   * Decline a friend request
   */
  async declineFriendRequest(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const requestId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (isNaN(requestId)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request ID' },
        });
      }

      await this.friendService.declineFriendRequest(requestId, userId);

      res.status(200).json({
        success: true,
        message: 'Friend request declined',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to decline friend request',
        },
      });
    }
  }

  /**
   * GET /api/v1/friends
   * Get all friends
   */
  async getFriends(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const friends = await this.friendService.getFriends(userId);

      res.status(200).json({
        success: true,
        data: friends,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch friends',
        },
      });
    }
  }

  /**
   * DELETE /api/v1/friends/:id
   * Remove a friend
   */
  async removeFriend(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const friendId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      if (isNaN(friendId)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid friend ID' },
        });
      }

      await this.friendService.removeFriend(userId, friendId);

      res.status(200).json({
        success: true,
        message: 'Friend removed successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to remove friend',
        },
      });
    }
  }
}
