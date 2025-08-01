import type { User, LeaderboardEntry } from "@/types"
import { Logger } from "@/lib/logger/logger"

export interface IUserService {
  getCurrentUser(): User | null
  updateUserPoints(points: number): void
  updateUserStreak(isCorrect: boolean): void
  getLeaderboard(): LeaderboardEntry[]
  updateLeaderboard(user: User): void
}

export class UserService implements IUserService {
  private static instance: UserService
  private logger: Logger

  private constructor() {
    this.logger = Logger.getInstance()
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        return JSON.parse(userData)
      }

      // Create default user
      const defaultUser: User = {
        id: `user-${Date.now()}`,
        name: "Anonymous",
        points: 0,
        streak: 0,
        totalQuizzes: 0,
        correctAnswers: 0,
        createdAt: new Date(),
      }

      this.saveUser(defaultUser)
      return defaultUser
    } catch (error) {
      this.logger.error("Error loading user data", error)
      return null
    }
  }

  updateUserPoints(points: number): void {
    const user = this.getCurrentUser()
    if (user) {
      user.points += points
      this.saveUser(user)
    }
  }

  updateUserStreak(isCorrect: boolean): void {
    const user = this.getCurrentUser()
    if (user) {
      user.totalQuizzes += 1
      if (isCorrect) {
        user.correctAnswers += 1
        user.streak += 1
      } else {
        user.streak = 0
      }
      this.saveUser(user)
    }
  }

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const leaderboardData = localStorage.getItem("leaderboard")
      const leaderboard = leaderboardData ? JSON.parse(leaderboardData) : []

      // Add sample users if empty
      if (leaderboard.length === 0) {
        leaderboard.push(...this.getSampleUsers())
      }

      // Add current user if not exists
      const currentUser = this.getCurrentUser()
      if (currentUser && !leaderboard.find((entry: LeaderboardEntry) => entry.id === currentUser.id)) {
        leaderboard.push({
          id: currentUser.id,
          name: currentUser.name,
          points: currentUser.points,
          rank: 0,
          streak: currentUser.streak,
        })
      }

      // Sort and assign ranks
      return leaderboard
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.points - a.points)
        .map((entry: LeaderboardEntry, index: number) => ({
          ...entry,
          rank: index + 1,
        }))
        .slice(0, 20)
    } catch (error) {
      this.logger.error("Error loading leaderboard", error)
      return []
    }
  }

  updateLeaderboard(user: User): void {
    try {
      const leaderboard = this.getLeaderboard()
      const userIndex = leaderboard.findIndex((entry) => entry.id === user.id)

      const userEntry: LeaderboardEntry = {
        id: user.id,
        name: user.name,
        points: user.points,
        rank: 0,
        streak: user.streak,
      }

      if (userIndex >= 0) {
        leaderboard[userIndex] = userEntry
      } else {
        leaderboard.push(userEntry)
      }

      localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
    } catch (error) {
      this.logger.error("Error updating leaderboard", error)
    }
  }

  private saveUser(user: User): void {
    try {
      localStorage.setItem("currentUser", JSON.stringify(user))
      this.updateLeaderboard(user)
    } catch (error) {
      this.logger.error("Error saving user data", error)
    }
  }

  private getSampleUsers(): LeaderboardEntry[] {
    return [
      { id: "1", name: "WikiMaster", points: 850, rank: 0, streak: 12 },
      { id: "2", name: "KnowledgeSeeker", points: 720, rank: 0, streak: 8 },
      { id: "3", name: "FactFinder", points: 680, rank: 0, streak: 15 },
      { id: "4", name: "StudyBuddy", points: 590, rank: 0, streak: 5 },
      { id: "5", name: "QuizChamp", points: 520, rank: 0, streak: 3 },
    ]
  }
}
