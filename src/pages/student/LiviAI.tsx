
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
      <div className="flex h-screen w-full">
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
          <LiviAIHeader
            currentSession={currentSession}
            onStartSession={startSession}
            onEndSession={handleEndSession}
            hasCredits={hasCredits}
          />

          {/* Chat Area - ocupa todo espaço restante */}
          <div className="flex-1 min-h-0 overflow-hidden">
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
  );
};

export default LiviAI;
