'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Menu, X, Download, ArrowRight, Clock, CheckCircle, AlertCircle, Mic, MicOff, Volume2, VolumeX, Play, Square } from 'lucide-react'

type ViewType = 'dashboard' | 'setup' | 'interview' | 'transcript'
type InterviewStatus = 'completed' | 'evaluated' | 'pending'

interface Interview {
  id: string
  candidateName: string
  positionLevel: 'Junior' | 'Mid' | 'Senior'
  date: string
  status: InterviewStatus
  score?: number
  transcript?: TranscriptItem[]
  evaluation?: EvaluationData
  notes?: string
}

interface TranscriptItem {
  timestamp: string
  speaker: 'interviewer' | 'candidate'
  content: string
  phase?: string
  competency_area?: string
}

interface EvaluationData {
  overall_score: { weighted_average: number }
  scores: {
    html_css: { score: number }
    javascript: { score: number }
    frameworks: { score: number }
    problem_solving: { score: number }
  }
  strengths: Array<{ area: string; description: string }>
  weaknesses: Array<{ area: string; description: string }>
  recommendation: { decision: 'Hire' | 'Consider' | 'Pass'; summary: string }
}

interface InterviewSession {
  candidateName: string
  positionLevel: 'Junior' | 'Mid' | 'Senior'
  notes: string
  messages: Array<{ role: string; content: string }>
  startTime: number
}

// Mock data for demo
const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'John Smith',
    positionLevel: 'Mid',
    date: '2025-01-15',
    status: 'evaluated',
    score: 7.4,
    transcript: [
      {
        timestamp: '00:00',
        speaker: 'interviewer',
        content: 'Welcome John! Today we will conduct a 20-minute technical interview covering HTML/CSS, JavaScript, React, and problem-solving.',
        phase: 'introduction'
      },
      {
        timestamp: '00:45',
        speaker: 'candidate',
        content: 'Thank you for having me. I am excited to discuss frontend development.',
        phase: 'introduction'
      },
      {
        timestamp: '01:30',
        speaker: 'interviewer',
        content: 'Can you explain the difference between Flexbox and CSS Grid?',
        phase: 'html_css',
        competency_area: 'html_css'
      },
      {
        timestamp: '02:15',
        speaker: 'candidate',
        content: 'Flexbox is a one-dimensional layout model for arranging items in rows or columns. Grid is two-dimensional and allows precise control over both rows and columns. I would use Grid for overall page layouts and Flexbox for component-level layouts.',
        phase: 'html_css'
      }
    ],
    evaluation: {
      overall_score: { weighted_average: 7.4 },
      scores: {
        html_css: { score: 8 },
        javascript: { score: 7 },
        frameworks: { score: 8 },
        problem_solving: { score: 7 }
      },
      strengths: [
        { area: 'React Hooks', description: 'Deep understanding of hooks lifecycle' },
        { area: 'CSS Layouts', description: 'Strong command of Flexbox and Grid' },
        { area: 'Async JavaScript', description: 'Clear understanding of promises' }
      ],
      weaknesses: [
        { area: 'Error Handling', description: 'Could improve on error boundary patterns' },
        { area: 'Testing', description: 'Limited testing experience mentioned' }
      ],
      recommendation: {
        decision: 'Consider',
        summary: 'Strong mid-level candidate with solid React fundamentals. Minor gaps in testing are addressable with onboarding.'
      }
    }
  },
  {
    id: '2',
    candidateName: 'Sarah Johnson',
    positionLevel: 'Senior',
    date: '2025-01-14',
    status: 'evaluated',
    score: 8.6,
    transcript: [],
    evaluation: {
      overall_score: { weighted_average: 8.6 },
      scores: {
        html_css: { score: 9 },
        javascript: { score: 9 },
        frameworks: { score: 8 },
        problem_solving: { score: 8 }
      },
      strengths: [
        { area: 'System Design', description: 'Excellent architectural thinking' },
        { area: 'Performance', description: 'Deep knowledge of optimization techniques' },
        { area: 'Leadership', description: 'Strong mentoring perspective' }
      ],
      weaknesses: [],
      recommendation: {
        decision: 'Hire',
        summary: 'Exceptional senior-level candidate with comprehensive expertise across all frontend competencies.'
      }
    }
  },
  {
    id: '3',
    candidateName: 'Alex Chen',
    positionLevel: 'Junior',
    date: '2025-01-13',
    status: 'completed',
    transcript: [],
    evaluation: undefined
  }
]

// Dashboard Component
function Dashboard({ onNewInterview, onSelectInterview }: any) {
  const totalInterviews = mockInterviews.length
  const pendingEvaluations = mockInterviews.filter(i => i.status === 'completed').length
  const thisWeek = mockInterviews.filter(i => {
    const date = new Date(i.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date > weekAgo
  }).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Interview Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage and evaluate frontend developer candidates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalInterviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingEvaluations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{thisWeek}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <Button onClick={onNewInterview} className="bg-blue-600 hover:bg-blue-700" size="lg">
        New Interview
      </Button>

      {/* Recent Interviews */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Interviews</h2>
        <div className="space-y-3">
          {mockInterviews.map(interview => (
            <Card
              key={interview.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectInterview(interview)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
                    <p className="text-sm text-gray-600">{interview.positionLevel} Level • {interview.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {interview.status === 'evaluated' && interview.score && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{interview.score.toFixed(1)}</div>
                        <p className="text-xs text-gray-600">/ 10</p>
                      </div>
                    )}
                    <Badge
                      variant={
                        interview.status === 'evaluated'
                          ? 'default'
                          : interview.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {interview.status === 'evaluated' ? 'Evaluated' : interview.status === 'completed' ? 'Ready' : 'Pending'}
                    </Badge>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Interview Setup Component
function InterviewSetup({ onStartInterview, onCancel }: any) {
  const [candidateName, setCandidateName] = useState('')
  const [positionLevel, setPositionLevel] = useState<'Junior' | 'Mid' | 'Senior'>('Mid')
  const [notes, setNotes] = useState('')

  const handleStart = () => {
    if (candidateName.trim()) {
      onStartInterview({ candidateName, positionLevel, notes })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Start New Interview</CardTitle>
          <CardDescription>Enter candidate details to begin the interview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Candidate Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Position Level</Label>
            <Select value={positionLevel} onValueChange={(value: any) => setPositionLevel(value)}>
              <SelectTrigger id="level" className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                <SelectItem value="Mid">Mid-level (2-5 years)</SelectItem>
                <SelectItem value="Senior">Senior (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional context about the candidate"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="border-gray-300"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={!candidateName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Interview Chat Component
function InterviewChat({ session, onComplete }: any) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; id: string }>>(
    (session?.messages || []).map((m: any, i: number) => ({
      ...m,
      id: `msg-${i}`
    }))
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutes in seconds
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognitionRef, setRecognitionRef] = useState<any>(null)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      completeInterview()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition && !recognitionRef) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setCurrentTranscript('')
      }

      recognition.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            setCurrentTranscript(prev => prev + transcript + ' ')
          } else {
            interim += transcript
          }
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      setRecognitionRef(recognition)
    }
  }, [recognitionRef])

  // Auto-scroll
  useEffect(() => {
    const scrollArea = document.getElementById('chat-scroll')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  // Text-to-speech function
  const speakText = (text: string) => {
    if (!voiceEnabled) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (recognitionRef && !isListening) {
      setCurrentTranscript('')
      recognitionRef.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef && isListening) {
      recognitionRef.stop()
    }
  }

  const submitVoiceInput = () => {
    if (currentTranscript.trim()) {
      setInput(currentTranscript.trim())
      setCurrentTranscript('')
      stopListening()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input, id: `msg-${messages.length}` }
    setMessages(prev => [...prev, userMessage])
    const userText = input
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          agent_id: '69328108e6ce9b78c3893b6e',
          context: {
            candidate_name: session.candidateName,
            position_level: session.positionLevel,
            interview_type: 'frontend_developer'
          }
        })
      })

      const data = await response.json()

      if (data.success && data.response) {
        let agentMessage = ''
        if (typeof data.response === 'string') {
          agentMessage = data.response
        } else if (data.response.content) {
          agentMessage = data.response.content
        } else {
          agentMessage = JSON.stringify(data.response)
        }

        setMessages(prev => [...prev, { role: 'assistant', content: agentMessage, id: `msg-${prev.length}` }])

        // Speak the agent response if voice is enabled
        if (voiceEnabled) {
          speakText(agentMessage)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeInterview = () => {
    const transcript: TranscriptItem[] = messages.map((msg, idx) => ({
      timestamp: formatTime(Math.floor((idx / messages.length) * 1200)),
      speaker: msg.role === 'user' ? 'candidate' : 'interviewer',
      content: msg.content
    }))

    onComplete({
      candidateName: session.candidateName,
      positionLevel: session.positionLevel,
      transcript,
      notes: session.notes
    })
  }

  const progressPercent = ((1200 - timeLeft) / 1200) * 100

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.candidateName}</h1>
            <p className="text-sm text-gray-600">{session.positionLevel} Level Interview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Clock className="w-5 h-5 text-gray-600" />
                <div className="text-2xl font-mono font-bold text-gray-900">{formatTime(timeLeft)}</div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Time Remaining</p>
            </div>
            <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEndDialog(true)}
                className="text-red-600 hover:text-red-700"
              >
                End Interview
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End Interview Early?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to end the interview now? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3">
                  <AlertDialogCancel>Continue</AlertDialogCancel>
                  <AlertDialogAction onClick={completeInterview} className="bg-red-600 hover:bg-red-700">
                    End Interview
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea id="chat-scroll" className="flex-1 p-6">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Waiting for first question from interviewer...</p>
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area - Voice & Text Combined */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Voice Controls */}
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              variant={voiceEnabled ? 'default' : 'outline'}
              size="sm"
              className={voiceEnabled ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Voice On
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Voice Off
                </>
              )}
            </Button>

            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? 'default' : 'outline'}
              size="sm"
              className={isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Speaking
                </>
              )}
            </Button>

            {currentTranscript && (
              <Button
                onClick={submitVoiceInput}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Use Voice Input
              </Button>
            )}

            {isSpeaking && (
              <div className="flex items-center gap-2 text-sm text-blue-600 ml-auto">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Interviewer Speaking...
              </div>
            )}
          </div>

          {/* Voice Transcript Display */}
          {currentTranscript && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Detected: </span>
                {currentTranscript}
              </p>
            </div>
          )}

          {/* Text Input (Optional) */}
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Or type your response..."
            className="border-gray-300 resize-none"
            rows={3}
            disabled={loading}
          />

          <div className="flex gap-3 justify-end">
            <Button
              onClick={sendMessage}
              disabled={loading || (!input.trim() && !currentTranscript.trim())}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Send Response
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Transcript & Evaluation Component
function TranscriptEvaluation({ interview, onEvaluate, onBack }: any) {
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState(interview.evaluation)

  const handleEvaluate = async () => {
    setEvaluating(true)
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please evaluate this interview transcript:\n\nCandidate: ${interview.candidateName}\nLevel: ${interview.positionLevel}\n\nTranscript:\n${interview.transcript
            .map(t => `${t.speaker}: ${t.content}`)
            .join('\n')}`,
          agent_id: '693281521f3e985c1e35b91c',
          context: {
            transcript: interview.transcript,
            candidate_name: interview.candidateName,
            position_level: interview.positionLevel
          }
        })
      })

      const data = await response.json()

      if (data.success && data.response) {
        const evalData = typeof data.response === 'string' ? JSON.parse(data.response) : data.response
        setEvaluation(evalData)
        onEvaluate(interview.id, evalData)
      }
    } catch (error) {
      console.error('Evaluation error:', error)
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{interview.candidateName}</h1>
            <p className="text-gray-600">{interview.positionLevel} Level • {interview.date}</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {/* Transcript Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {interview.transcript?.map((item: TranscriptItem, idx: number) => (
                    <div key={idx}>
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                            item.speaker === 'interviewer' ? 'bg-blue-600' : 'bg-green-600'
                          }`}
                        >
                          {item.speaker === 'interviewer' ? 'I' : 'C'}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            {item.speaker === 'interviewer' ? 'Interviewer' : 'Candidate'}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">{item.content}</p>
                        </div>
                      </div>
                      {idx < interview.transcript.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Section */}
        <div className="lg:col-span-2 space-y-6">
          {evaluation ? (
            <>
              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(evaluation.scores || {}).map(([key, value]: any) => (
                  <Card key={key}>
                    <CardContent className="pt-6">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2 capitalize">
                        {key.replace(/_/g, ' ')}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-bold text-gray-900">{value.score}</div>
                        <div className="text-sm text-gray-600">/ 10</div>
                      </div>
                      <p className="text-xs text-gray-600 mt-3">{value.justification}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Weighted Average</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {evaluation.overall_score?.weighted_average.toFixed(1)}/10
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recommendation</p>
                      <Badge
                        className={`mt-2 ${
                          evaluation.recommendation?.decision === 'Hire'
                            ? 'bg-green-100 text-green-800'
                            : evaluation.recommendation?.decision === 'Consider'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {evaluation.recommendation?.decision}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <p className="text-sm text-gray-700">{evaluation.recommendation?.summary}</p>
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {evaluation.strengths?.map((strength: any, idx: number) => (
                        <li key={idx}>
                          <p className="font-semibold text-gray-900 text-sm">{strength.area}</p>
                          <p className="text-sm text-gray-600">{strength.description}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Areas for Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {evaluation.weaknesses?.map((weakness: any, idx: number) => (
                        <li key={idx}>
                          <p className="font-semibold text-gray-900 text-sm">{weakness.area}</p>
                          <p className="text-sm text-gray-600">{weakness.description}</p>
                          {weakness.recommendation && (
                            <p className="text-sm text-blue-600 mt-1">Recommendation: {weakness.recommendation}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-900 font-semibold">No Evaluation Yet</p>
                  <p className="text-gray-600 text-sm mt-1">Click the button below to start evaluation</p>
                </div>
                <Button
                  onClick={handleEvaluate}
                  disabled={evaluating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {evaluating ? 'Evaluating...' : 'Evaluate Interview'}
                </Button>
              </div>
            </Card>
          )}

          {evaluation && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main App Component
export default function HomePage() {
  const [view, setView] = useState<ViewType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  const handleNewInterview = () => {
    setView('setup')
  }

  const handleStartInterview = (setup: any) => {
    setCurrentSession({
      ...setup,
      messages: [],
      startTime: Date.now()
    })
    setView('interview')
  }

  const handleInterviewComplete = (data: any) => {
    const newInterview: Interview = {
      id: Date.now().toString(),
      candidateName: data.candidateName,
      positionLevel: data.positionLevel,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      transcript: data.transcript,
      notes: data.notes
    }
    setInterviews(prev => [newInterview, ...prev])
    setSelectedInterview(newInterview)
    setView('transcript')
  }

  const handleSelectInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setView('transcript')
  }

  const handleEvaluate = (id: string, evaluation: EvaluationData) => {
    setInterviews(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'evaluated', evaluation, score: evaluation.overall_score.weighted_average } : i))
    )
    if (selectedInterview?.id === id) {
      setSelectedInterview(prev => (prev ? { ...prev, status: 'evaluated', evaluation, score: evaluation.overall_score.weighted_average } : null))
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Frontend Interview</h1>
          <p className="text-gray-400 text-xs mt-1">AI-Powered Assessment</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              setView('dashboard')
              setSidebarOpen(false)
            }}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            Dashboard
          </button>
          <button
            onClick={handleNewInterview}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            New Interview
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
            Interview History
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-400">User Menu</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        {view !== 'interview' && (
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className={view === 'interview' ? 'flex-1' : 'flex-1 overflow-auto p-6'}>
          {view === 'dashboard' && (
            <Dashboard onNewInterview={handleNewInterview} onSelectInterview={handleSelectInterview} />
          )}
          {view === 'setup' && (
            <InterviewSetup onStartInterview={handleStartInterview} onCancel={() => setView('dashboard')} />
          )}
          {view === 'interview' && currentSession && <InterviewChat session={currentSession} onComplete={handleInterviewComplete} />}
          {view === 'transcript' && selectedInterview && (
            <TranscriptEvaluation
              interview={selectedInterview}
              onEvaluate={handleEvaluate}
              onBack={() => setView('dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
