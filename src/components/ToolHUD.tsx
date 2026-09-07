import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { ToolExecution } from '../types';

interface ToolHUDProps {
  lastTool: ToolExecution | null;
}

export const ToolHUD: React.FC<ToolHUDProps> = ({ lastTool }) => {
  if (!lastTool) return null;

  const isRecent = Date.now() - lastTool.timestamp < 12000;
  if (!isRecent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        id="tool-hud-card"
        className="w-full max-w-sm mx-auto px-4 z-30"
      >
        <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  FUNCTION EXECUTION
                </span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-xs font-sans text-zinc-200 truncate font-medium">
                {lastTool.name === 'openWebsite' && (
                  <>
                    Opened{' '}
                    <span className="text-white font-semibold">
                      {lastTool.args.siteName || lastTool.args.url}
                    </span>
                  </>
                )}
                {lastTool.name === 'setAtmosphere' && (
                  <>
                    Atmosphere set to{' '}
                    <span className="text-white font-semibold capitalize">
                      {lastTool.args.atmosphere}
                    </span>
                  </>
                )}
                {lastTool.name === 'getCurrentTime' && (
                  <>
                    Retrieved local time:{' '}
                    <span className="text-white font-semibold">
                      {lastTool.result?.time || new Date().toLocaleTimeString()}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick link button if openWebsite */}
          {lastTool.name === 'openWebsite' && lastTool.args.url && (
            <a
              href={lastTool.args.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition-all"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
