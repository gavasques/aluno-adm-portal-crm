
import React from 'react';
import { SessionHistorySidebar } from '@/components/livi-ai/SessionHistorySidebar';
import { LiviAIChatArea } from '@/components/livi-ai/LiviAIChatArea';
import { LiviAIHeader } from '@/components/livi-ai/LiviAIHeader';
import { useLiviAILogic } from '@/hooks/useLiviAILogic';

const LiviAI = () => {
  const {
    sessions,
    currentSession,
    sessionMessages,
    message,
    setMessage,
    isLoading,
    sessionsLoading,
    messagesLoading,
    startSession,
    handleEndSession,
    sendMessage,
    selectSession,
    deleteSession,
    renameSession,
    hasCredits
  } = useLiviAILogic();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 overflow-x-hidden">
      <div className="flex h-screen w-full max-w-full">
        {/* Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0 h-full overflow-hidden">
          <SessionHistorySidebar
            sessions={sessions}
            currentSession={currentSession}
            onSelectSession={selectSession}
            onDeleteSession={deleteSession}
            onRenameSession={renameSession}
            loading={sessionsLoading}
          />
        </div>

        {/* Main Content - Centralized and Responsive */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden max-w-full">
          {/* Header */}
          <div className="flex-shrink-0 w-full overflow-x-hidden">
            <LiviAIHeader
              currentSession={currentSession}
              onStartSession={startSession}
              onEndSession={handleEndSession}
              hasCredits={hasCredits}
            />
          </div>

          {/* Chat Area - Centralized with proper spacing */}
          <div className="flex-1 min-h-0 overflow-hidden py-4 sm:py-6 lg:py-8">
            <div className="h-full w-full max-w-full mx-auto px-2 sm:px-4 lg:px-6">
              <div className="h-full max-w-4xl mx-auto">
                <LiviAIChatArea
                  messages={sessionMessages}
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                  hasCredits={hasCredits}
                  isSessionActive={currentSession?.is_active || false}
                  messagesLoading={messagesLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiviAI;
