import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge, SearchInput, Stat } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { listBank, deleteBankItem, saveBankItem, listQuizzes } from '../../../data/quizzes.js';
import { getPortalUser } from '../../../lib/portalAuth.js';
import cn from '../../../lib/cn.js';

const TYPE_LABELS = {
  'mcq-single': 'Multiple choice',
  'mcq-multi': 'Multi-select',
  'tf': 'True / False',
  'short': 'Short answer',
  'essay': 'Essay',
  'matching': 'Matching',
  'fill': 'Fill in the blanks',
};

export default function QuestionBank() {
  const user = getPortalUser();
  const [bank, setBank] = useState(() => listBank(user.id));
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [editing, setEditing] = useState(null);

  const myQuizzes = listQuizzes(user.id);

  const filtered = useMemo(() => {
    return bank.filter((item) => {
      if (type !== 'all' && item.type !== type) return false;
      if (difficulty !== 'all' && item.difficulty !== difficulty) return false;
      if (q && !`${item.prompt} ${(item.tags || []).join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [bank, q, type, difficulty]);

  const usedIn = (qid) =>
    myQuizzes.filter((qz) => qz.questions.includes(qid)).map((qz) => qz.title);

  function handleSave(item) {
    const saved = saveBankItem(item);
    setBank(listBank(user.id));
    setEditing(null);
  }

  function handleDelete(id) {
    if (!confirm('Delete this question from your bank?')) return;
    deleteBankItem(id);
    setBank(listBank(user.id));
  }

  const stats = useMemo(() => {
    const total = bank.length;
    const byType = Object.keys(TYPE_LABELS).reduce((acc, k) => {
      acc[k] = bank.filter((q) => q.type === k).length;
      return acc;
    }, {});
    return { total, byType };
  }, [bank]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Question bank"
        subtitle="Reusable questions. Drag them into any quiz from the authoring screen."
        actions={
          <button
            type="button"
            onClick={() => setEditing({ instructorId: user.id, type: 'mcq-single', points: 1, difficulty: 'medium', tags: [], prompt: '', options: ['', '', '', ''], correctIndex: 0 })}
            className="c-button c-button--primary !py-2.5"
          >
            <Icon name="plus" className="c-icon--sm" />
            New question
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Questions" value={stats.total} sub="In your bank" icon={<Icon name="help-circle" className="c-icon--sm" />} />
        <Stat label="MCQ" value={stats.byType['mcq-single']} sub="Single-answer" icon={<Icon name="list-checks" className="c-icon--sm" />} />
        <Stat label="Essay" value={stats.byType.essay} sub="Awaiting manual grading" icon={<Icon name="file-text" className="c-icon--sm" />} />
        <Stat label="Used in" value={myQuizzes.length} sub="Quizzes referencing bank" icon={<Icon name="book-open" className="c-icon--sm" />} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput value={q} onChange={setQ} placeholder="Search by prompt or tag…" />
          </div>
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="all">All types</option>
              {Object.entries(TYPE_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="all">All levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </Card>

      {editing && (
        <QuestionEditor
          item={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Card>
            <p className="py-8 text-center text-sm text-body">No questions match your filters.</p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-wrap items-start gap-4">
                <span className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-lg',
                  item.type === 'essay' ? 'bg-pill/20 text-pill-ink' :
                  item.type === 'mcq-single' || item.type === 'mcq-multi' ? 'bg-cyan/15 text-cyan-deep' :
                  item.type === 'tf' ? 'bg-emerald-500/15 text-emerald-700' :
                  'bg-band text-body'
                )}>
                  <Icon
                    name={item.type === 'essay' ? 'file-text' : item.type === 'tf' ? 'check-circle' : 'list-checks'}
                    className="c-icon--md"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="cyan">{TYPE_LABELS[item.type]}</Badge>
                    <Badge tone="muted">{item.points} pt{item.points !== 1 ? 's' : ''}</Badge>
                    <Badge tone={item.difficulty === 'easy' ? 'success' : item.difficulty === 'medium' ? 'pill' : 'warn'}>
                      {item.difficulty}
                    </Badge>
                    {(item.tags || []).map((t) => (
                      <span key={t} className="rounded bg-band px-2 py-0.5 text-[11px] font-semibold text-body">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-medium text-heading">{item.prompt}</p>
                  {item.type === 'mcq-single' && (
                    <ul className="mt-2 space-y-1 text-xs">
                      {item.options.map((opt, i) => (
                        <li key={i} className={cn('flex items-center gap-2', i === item.correctIndex && 'font-semibold text-emerald-700')}>
                          <Icon name={i === item.correctIndex ? 'check-circle' : 'circle-help'} className={cn('c-icon--xs', i === item.correctIndex ? 'fill-emerald-500' : 'fill-body/40')} />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-xs text-body/70">
                    Used in: {usedIn(item.id).length > 0 ? usedIn(item.id).join(', ') : 'No quizzes yet'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="rounded-sm border border-line bg-paper px-3 py-1.5 text-xs font-semibold hover:bg-band"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-sm border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function QuestionEditor({ item, onSave, onCancel }) {
  const [draft, setDraft] = useState(item);

  function set(k, v) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function submit() {
    if (!draft.prompt?.trim()) return;
    const id = draft.id || 'B-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    onSave({ ...draft, id, instructorId: draft.instructorId });
  }

  return (
    <Card className="border-2 border-accent">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="h4 text-heading">{draft.id ? 'Edit question' : 'New question'}</h3>
        <button type="button" onClick={onCancel} aria-label="Close" className="grid size-8 place-items-center rounded-md text-body hover:bg-band">
          <Icon name="cross" className="c-icon--sm" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Type</span>
          <select value={draft.type} onChange={(e) => set('type', e.target.value)} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent">
            {Object.entries(TYPE_LABELS).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Points</span>
          <input type="number" min="1" value={draft.points || 1} onChange={(e) => set('points', Number(e.target.value))} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Difficulty</span>
          <select value={draft.difficulty || 'medium'} onChange={(e) => set('difficulty', e.target.value)} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Prompt</span>
        <textarea
          rows={3}
          value={draft.prompt || ''}
          onChange={(e) => set('prompt', e.target.value)}
          className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      {(draft.type === 'mcq-single' || draft.type === 'mcq-multi') && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Options</p>
          <ul className="flex flex-col gap-2">
            {(draft.options || []).map((opt, i) => (
              <li key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => set('correctIndex', i)}
                  className={
                    'grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold ' +
                    (draft.correctIndex === i ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-line bg-paper text-body hover:border-accent')
                  }
                  aria-label={draft.correctIndex === i ? 'Correct' : 'Mark as correct'}
                >
                  {draft.correctIndex === i ? '✓' : String.fromCharCode(65 + i)}
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...draft.options];
                    next[i] = e.target.value;
                    set('options', next);
                  }}
                  className="flex-1 rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
                />
                {(draft.options || []).length > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = draft.options.filter((_, idx) => idx !== i);
                      set('options', next);
                      if (draft.correctIndex >= next.length) set('correctIndex', 0);
                    }}
                    aria-label="Remove option"
                    className="grid size-8 place-items-center rounded-md text-body hover:bg-red-50 hover:text-red-600"
                  >
                    <Icon name="cross" className="c-icon--sm" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => set('options', [...(draft.options || []), ''])}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            <Icon name="plus" className="c-icon--xs" /> Add option
          </button>
        </div>
      )}

      {draft.type === 'tf' && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Correct answer</p>
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => set('correct', v)}
                className={
                  'rounded-sm border-2 px-4 py-2 text-sm font-semibold ' +
                  (draft.correct === v ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-paper text-body hover:border-accent/60')
                }
              >
                {v ? 'True' : 'False'}
              </button>
            ))}
          </div>
        </div>
      )}

      {draft.type === 'short' && (
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Acceptable answers (comma-separated)</span>
          <input
            type="text"
            value={(draft.acceptableAnswers || []).join(', ')}
            onChange={(e) => set('acceptableAnswers', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
      )}

      {draft.type === 'essay' && (
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Word limit (optional)</span>
          <input
            type="number"
            value={draft.wordLimit || ''}
            onChange={(e) => set('wordLimit', Number(e.target.value) || null)}
            className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
      )}

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Tags</span>
        <input
          type="text"
          value={(draft.tags || []).join(', ')}
          onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          placeholder="algebra, equations, …"
          className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-body hover:text-heading">
          Cancel
        </button>
        <button type="button" onClick={submit} className="c-button c-button--primary !py-2.5">
          <Icon name="save" className="c-icon--sm" />
          Save question
        </button>
      </div>
    </Card>
  );
}