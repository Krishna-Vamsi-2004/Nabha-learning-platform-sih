"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Settings, LogIn, Menu, X, CheckCircle, Award } from "lucide-react"
import { registerServiceWorker } from "@/lib/pwa-utils"
import { offlineStorage } from "@/lib/offline-storage"
import { authService } from "@/lib/auth"
import { i18n } from "@/lib/i18n"
import { syncService } from "@/lib/sync"
import { LanguageSelector } from "@/components/language-selector"
import { SyncStatusIndicator } from "@/components/sync-status"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Counters
  const [students, setStudents] = useState(0)
  const [teachers, setTeachers] = useState(0)
  const [schools, setSchools] = useState(0)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await registerServiceWorker()
        await offlineStorage.init()
        await authService.init()
        i18n.init()
        syncService.init()
        setCurrentUser(authService.getCurrentUser())
      } catch (error) {
        console.error("App initialization failed:", error)
      } finally {
        setIsLoading(false)
      }
    }
    initializeApp()
  }, [])

  // Animated counter effect
  useEffect(() => {
    let s = 0, t = 0, sc = 0
    const studentInterval = setInterval(() => {
      s += 10
      if (s >= 500) {
        s = 500
        clearInterval(studentInterval)
      }
      setStudents(s)
    }, 20)

    const teacherInterval = setInterval(() => {
      t += 2
      if (t >= 50) {
        t = 50
        clearInterval(teacherInterval)
      }
      setTeachers(t)
    }, 40)

    const schoolInterval = setInterval(() => {
      sc += 1
      if (sc >= 25) {
        sc = 25
        clearInterval(schoolInterval)
      }
      setSchools(sc)
    }, 60)

    return () => {
      clearInterval(studentInterval)
      clearInterval(teacherInterval)
      clearInterval(schoolInterval)
    }
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    setCurrentUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse-slow" />
          <div className="space-y-2">
            <div className="h-2 w-32 bg-muted rounded-full animate-pulse mx-auto"></div>
            <div className="h-2 w-24 bg-muted rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4 text-lg">{i18n.t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-card to-muted">
      {/* Navbar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground tracking-tight">{i18n.t("platformName")}</h1>
              <p className="text-sm text-muted-foreground">{i18n.t("platformDescription")}</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            <SyncStatusIndicator />
            <LanguageSelector />
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-card-foreground">
                    {i18n.t("welcome")}, {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-lg font-medium"
                >
                  {i18n.t("logout")}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => (window.location.href = "/auth/login")}
                className="rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {i18n.t("login")}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6 text-card-foreground" /> : <Menu className="h-6 w-6 text-card-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card/90 backdrop-blur-sm border-t border-border">
            <div className="flex flex-col px-4 py-4 gap-4">
              <SyncStatusIndicator />
              <LanguageSelector />
              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-card-foreground">
                    {i18n.t("welcome")}, {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="rounded-lg font-medium"
                  >
                    {i18n.t("logout")}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => (window.location.href = "/auth/login")}
                  className="rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {i18n.t("login")}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16 relative">
          <h2 className="text-5xl font-bold text-card-foreground mb-6 leading-tight">
            {i18n.t("welcome")} to <span className="text-primary">{i18n.t("platformName")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            An offline-first digital learning platform designed for rural schools. Access interactive lessons, quizzes,
            and track your progress even without internet connectivity.
          </p>

          {/* Animated Counters */}
          <div className="flex justify-center gap-20 mt-12 flex-wrap">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent">{students}+</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary">{teachers}+</div>
              <div className="text-sm text-muted-foreground">Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent">{schools}+</div>
              <div className="text-sm text-muted-foreground">Schools</div>
            </div>
          </div>
        </div>

        {/* Portals */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {/* Student Portal */}
          <Card className="flex flex-col justify-between group hover:shadow-xl transition-all duration-300 border hover:border-primary hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 p-4 bg-primary rounded-2xl w-fit shadow-md">
                <BookOpen className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{i18n.t("student")} Portal</CardTitle>
              <CardDescription className="text-base">
                Access lessons, take quizzes, and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                className="w-full h-12 text-base font-semibold rounded-lg"
                size="lg"
                onClick={() =>
                  currentUser && currentUser.role === "student"
                    ? (window.location.href = "/student")
                    : (window.location.href = "/auth/login")
                }
              >
                {currentUser && currentUser.role === "student"
                  ? `Go to ${i18n.t("dashboard")}`
                  : `Enter as ${i18n.t("student")}`}
              </Button>
            </CardContent>
          </Card>

          {/* Teacher Portal */}
          <Card className="flex flex-col justify-between group hover:shadow-xl transition-all duration-300 border hover:border-secondary hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 p-4 bg-secondary rounded-2xl w-fit shadow-md">
                <Users className="h-10 w-10 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">{i18n.t("teacher")} Portal</CardTitle>
              <CardDescription className="text-base">
                Monitor student progress, manage content, and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                className="w-full h-12 text-base font-semibold rounded-lg"
                size="lg"
                variant="secondary"
                onClick={() =>
                  currentUser && currentUser.role === "teacher"
                    ? (window.location.href = "/teacher")
                    : (window.location.href = "/auth/login")
                }
              >
                {currentUser && currentUser.role === "teacher"
                  ? `Go to ${i18n.t("dashboard")}`
                  : `Enter as ${i18n.t("teacher")}`}
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="flex flex-col justify-between group hover:shadow-xl transition-all duration-300 border hover:border-accent hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 p-4 bg-accent rounded-2xl w-fit shadow-md">
                <Settings className="h-10 w-10 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">{i18n.t("admin")} Portal</CardTitle>
              <CardDescription className="text-base">
                Manage content, users, and platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                className="w-full h-12 text-base font-semibold rounded-lg"
                size="lg"
                variant="default"
                onClick={() =>
                  currentUser && currentUser.role === "admin"
                    ? (window.location.href = "/admin")
                    : (window.location.href = "/auth/login")
                }
              >
                {currentUser && currentUser.role === "admin"
                  ? `Go to ${i18n.t("dashboard")}`
                  : `Enter as ${i18n.t("admin")}`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section (Replaces How It Works) */}
        <div className="bg-card/40 rounded-3xl p-12 backdrop-blur-sm mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-card-foreground mb-4">Platform Features</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the key features that make this platform ideal for rural schools.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border transform -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-12">
              {[
                { step: "Offline Access", desc: "Access lessons and quizzes without internet connectivity." },
                { step: "Interactive Lessons", desc: "Engage students with interactive content and quizzes." },
                { step: "Progress Tracking", desc: "Monitor students’ learning progress and performance." },
                { step: "Teacher Analytics", desc: "View detailed analytics to guide student learning." },
                { step: "Multi-Language Support", desc: "Use the platform in English, Hindi, and Punjabi." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center w-full ${idx % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
                >
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background z-10 hidden md:block"></div>
                  <div
                    className={`w-full md:w-5/12 p-6 rounded-2xl shadow-md bg-card border hover:shadow-xl transition-all ${
                      idx % 2 === 0 ? "md:text-right text-center" : "md:text-left text-center"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 mb-3 ${
                        idx % 2 === 0 ? "md:justify-end justify-center" : "md:justify-start justify-center"
                      }`}
                    >
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <h4 className="font-bold text-lg">{item.step}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-card/30 rounded-3xl p-12 backdrop-blur-sm">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-card-foreground mb-4">What Our Users Say</h3>
            <p className="text-muted-foreground">Real feedback from students and teachers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 italic">
                "This platform has transformed how we learn. Even without internet, I can access all my lessons!"
              </p>
              <div className="font-semibold text-card-foreground">Priya Singh</div>
              <div className="text-sm text-muted-foreground">Class 10 Student</div>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 italic">
                "The analytics help me understand each student's progress. It's incredibly useful for rural teaching."
              </p>
              <div className="font-semibold text-card-foreground">Rajesh Kumar</div>
              <div className="text-sm text-muted-foreground">Mathematics Teacher</div>
            </div>
            <div className="text-center">
              <Settings className="h-12 w-12 text-accent mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 italic">
                "Managing content across multiple schools has never been easier. The offline sync is perfect."
              </p>
              <div className="font-semibold text-card-foreground">Dr. Meera Patel</div>
              <div className="text-sm text-muted-foreground">School Administrator</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {i18n.t("platformName")}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
