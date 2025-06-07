
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
      {/* Container centralizado e limitado */}
      <div className="w-full min-h-screen py-4 sm:py-6 lg:py-10 px-2 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-5rem)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
          <div className="flex h-full w-full">
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
              {/* Header */}
              <div className="flex-shrink-0 w-full overflow-x-hidden">
                <LiviAIHeader
                  currentSession={currentSession}
                  onStartSession={startSession}
                  onEndSession={handleEndSession}
                  hasCredits={hasCredits}
                />
              </div>

              {/* Chat Area */}
              <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4 lg:p-6">
                <div className="h-full w-full max-w-4xl mx-auto">
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
    </div>
  );
};

export default LiviAI;
