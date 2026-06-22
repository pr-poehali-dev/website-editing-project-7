import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const HERO_IMAGE =
  'https://cdn.poehali.dev/projects/558acf59-52cc-49bf-86a4-c54c112bdadd/files/6c262dcc-d0f8-4f14-b585-7e714c676b1d.jpg';

const LOGO_IMAGE =
  'https://cdn.poehali.dev/projects/558acf59-52cc-49bf-86a4-c54c112bdadd/files/beddb1c4-1163-4999-adbf-c5fd6f755b54.jpg';

const CATEGORIES = [
  { id: 'care', label: 'Уход за ребёнком', icon: 'Baby', color: 'bg-lime-100 text-lime-700' },
  { id: 'health', label: 'Здоровье', icon: 'HeartPulse', color: 'bg-lime-100 text-lime-700' },
  { id: 'development', label: 'Развитие', icon: 'Sparkles', color: 'bg-lime-100 text-lime-700' },
  { id: 'nutrition', label: 'Питание', icon: 'Apple', color: 'bg-lime-100 text-lime-700' },
  { id: 'treatment', label: 'Лечение ребёнка', icon: 'Stethoscope', color: 'bg-lime-100 text-lime-700' },
];

type Post = {
  id: number;
  author: string;
  category: string;
  title: string;
  content: string;
  status: 'published' | 'pending';
  date: string;
};

type Question = {
  id: number;
  name: string;
  text: string;
  date: string;
};

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: 'Анна Петрова',
    category: 'care',
    title: 'Как наладить режим сна малыша',
    content:
      'Делюсь опытом: ритуалы перед сном творят чудеса. Тёплая ванна, спокойная музыка и приглушённый свет — и кроха засыпает за 10 минут.',
    status: 'published',
    date: '2 часа назад',
  },
  {
    id: 2,
    author: 'Анна Петрова',
    category: 'nutrition',
    title: 'Первый прикорм без стресса',
    content:
      'Начинали с овощных пюре по чайной ложке. Главное — не торопиться и следить за реакцией. Через месяц малыш ел уже всё с удовольствием!',
    status: 'published',
    date: '5 часов назад',
  },
  {
    id: 3,
    author: 'Анна Петрова',
    category: 'development',
    title: 'Развивающие игры до года',
    content:
      'Простые игры с фактурными игрушками отлично развивают мелкую моторику. Рассказываю, что работало у нас лучше всего.',
    status: 'published',
    date: 'вчера',
  },
];

type FormState = { author: string; title: string; category: string; content: string };

const emptyForm: FormState = { author: '', title: '', category: '', content: '' };

const Index = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAuthor, setIsAuthor] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [qName, setQName] = useState('');
  const [qText, setQText] = useState('');

  const handleLogin = () => {
    if (loginPassword === 'Cokolovaandpolina=vrachi') {
      setIsAuthor(true);
      setLoginOpen(false);
      setLoginPassword('');
      setLoginError(false);
      toast({ title: 'Добро пожаловать! 💚', description: 'Вы вошли в режим автора.' });
    } else {
      setLoginError(true);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setEditorOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditingId(post.id);
    setForm({ author: post.author, title: post.title, category: post.category, content: post.content });
    setEditorOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.category || !form.content.trim()) {
      toast({
        title: 'Заполните все поля',
        description: 'Заголовок, раздел и текст обязательны.',
        variant: 'destructive',
      });
      return;
    }
    if (!form.author.trim()) {
      setForm((f) => ({ ...f, author: 'Автор' }));
    }

    if (editingId !== null) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                author: form.author.trim(),
                title: form.title.trim(),
                category: form.category,
                content: form.content.trim(),
                date: 'обновлено только что',
              }
            : p
        )
      );
      toast({ title: 'Пост обновлён ✏️', description: 'Изменения сохранены.' });
    } else {
      const newPost: Post = {
        id: Date.now(),
        author: form.author.trim(),
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
        status: 'published',
        date: 'только что',
      };
      setPosts((prev) => [newPost, ...prev]);
      toast({
        title: 'Пост опубликован 💚',
        description: 'Пост появился в ленте.',
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    setEditorOpen(false);
  };

  const submitQuestion = () => {
    if (!qName.trim() || !qText.trim()) {
      toast({
        title: 'Заполните поля',
        description: 'Напишите имя и ваш вопрос.',
        variant: 'destructive',
      });
      return;
    }
    setQuestions((prev) => [
      { id: Date.now(), name: qName.trim(), text: qText.trim(), date: 'только что' },
      ...prev,
    ]);
    setQName('');
    setQText('');
    toast({ title: 'Спасибо! 💚', description: 'Ваш вопрос опубликован.' });
  };

  const visiblePosts = posts.filter(
    (p) =>
      (isAuthor || p.status === 'published') &&
      (activeCategory === 'all' || p.category === activeCategory)
  );

  const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2 cursor-pointer select-none" onDoubleClick={() => !isAuthor && setLoginOpen(true)}>
            <img src={LOGO_IMAGE} alt="Мамоград" className="h-11 w-11 rounded-2xl object-cover shadow-sm" />
            <span className="font-display text-3xl text-primary">Всё о малыше</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthor ? (
              <>
                <span className="hidden items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground sm:flex">
                  <Icon name="BadgeCheck" size={15} /> Режим автора
                </span>
                <Button onClick={openCreate} className="rounded-full gap-2">
                  <Icon name="PenLine" size={16} /> Написать пост
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setIsAuthor(false)}>
                  Выйти
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Всё, что хотите знать{' '}
            <span className="font-display text-primary">о вашем ребёнке</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Всё о малыше: уход, здоровье, развитие, питание. Делимся советами, поддержкой и теплом.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {isAuthor ? (
              <Button size="lg" className="rounded-full gap-2" onClick={openCreate}>
                <Icon name="PenLine" size={20} /> Написать пост
              </Button>
            ) : (
              <Button
                size="lg"
                className="rounded-full gap-2"
                onClick={() => document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Icon name="BookOpen" size={20} /> Читать посты
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => document.getElementById('questions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Задать вопрос
            </Button>
          </div>
        </div>
        <div className="animate-scale-in flex flex-col gap-[5rem] md:gap-[5rem]" style={{ gap: '5rem' }}>
          <blockquote className="rounded-2xl bg-accent/40 px-6 py-5 text-center font-display text-xl leading-snug text-primary md:text-2xl" style={{ marginBottom: 0 }}>
            «Самый большой подарок, который родители могут сделать своему ребёнку, — это атмосфера любви, потому что в такой атмосфере он развивается лучше всего»
          </blockquote>
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20">
            <img src={HERO_IMAGE} alt="Мама с малышом" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="feed" className="container py-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-2xl px-6 py-3 text-base font-semibold transition ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
            }`}
          >
            Все темы
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 rounded-2xl px-6 py-3 text-base font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
            >
              <Icon name={cat.icon} size={20} />
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Posts */}
      <main className="container grid gap-5 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
            <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-50" />
            В этом разделе пока нет постов.
          </div>
        )}
        {visiblePosts.map((post) => {
          const cat = getCategory(post.category);
          return (
            <article
              key={post.id}
              className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`flex items-center gap-2 rounded-2xl px-4 py-1.5 text-sm font-semibold ${cat?.color}`}
                >
                  <Icon name={cat?.icon || 'Tag'} size={16} />
                  {cat?.label}
                </span>
                {post.status === 'pending' && (
                  <span className="flex items-center gap-1.5 rounded-2xl bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700">
                    <Icon name="Clock" size={14} /> На проверке
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold leading-snug">{post.title}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                {post.content}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-sm text-muted-foreground">{post.date}</span>
                {isAuthor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-full text-primary"
                    onClick={() => openEdit(post)}
                  >
                    <Icon name="Pencil" size={14} /> Изменить
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </main>

      {/* Quote banner */}
      <section className="py-14 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10">
        <div className="container flex flex-col items-center text-center">
          <Icon name="Quote" size={36} className="mb-4 text-primary opacity-60" />
          <blockquote className="max-w-2xl font-display text-3xl leading-snug text-primary md:text-4xl">
            «Я люблю тебя дальше Солнца, Луны и звёзд»
          </blockquote>
          <p className="mt-4 text-base text-muted-foreground italic">— говорила она мне</p>
        </div>
      </section>

      {/* Questions section for readers */}
      <section id="questions" className="bg-secondary/40 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl leading-tight text-primary md:text-6xl">
              Задавайте или отвечайте на вопросы, наши дорогие мамочки и папочки! 💚
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Здесь можно спросить совета, поделиться переживанием или поддержать друг друга. Мы все вместе!
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="space-y-4">
              <Input
                placeholder="Как вас зовут?"
                value={qName}
                onChange={(e) => setQName(e.target.value)}
              />
              <Textarea
                placeholder="Ваш вопрос или сообщение..."
                rows={4}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
              />
              <Button onClick={submitQuestion} className="w-full rounded-full gap-2" size="lg">
                <Icon name="Send" size={18} /> Опубликовать вопрос
              </Button>
            </div>
          </div>

          {questions.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="animate-fade-in rounded-3xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {q.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold leading-none">{q.name}</p>
                      <p className="text-xs text-muted-foreground">{q.date}</p>
                    </div>
                  </div>
                  <p className="mt-3 leading-relaxed">{q.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center gap-2 py-10 text-center">
          <span className="font-display text-2xl text-primary">Всё о малыше</span>
          <p className="text-sm text-muted-foreground">
            Мамочкам и папочкам: уход, здоровье, развитие, питание
          </p>
        </div>
      </footer>

      {/* Post editor (author only) */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingId !== null ? 'Редактирование поста' : 'Новый пост'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Заголовок</label>
              <Input
                placeholder="О чём ваш пост?"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Раздел</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      form.category === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                    }`}
                  >
                    <Icon name={cat.icon} size={14} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Текст поста</label>
              <Textarea
                placeholder="Поделитесь своим опытом..."
                rows={5}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>
            {editingId === null && (
              <div className="flex items-center gap-2 rounded-2xl bg-accent/60 p-3 text-sm text-accent-foreground">
                <Icon name="ShieldCheck" size={18} />
                Пост появится в ленте после проверки модератором.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full rounded-full gap-2" size="lg">
              <Icon name="Send" size={18} />
              {editingId !== null ? 'Сохранить изменения' : 'Отправить на модерацию'}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Login dialog for author */}
      <Dialog open={loginOpen} onOpenChange={(open) => { setLoginOpen(open); setLoginPassword(''); setLoginError(false); }}>
        <DialogContent className="rounded-3xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Вход для автора</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Icon name="Lock" size={28} className="text-accent-foreground" />
              </div>
            </div>
            <div>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={loginError ? 'border-red-400 focus-visible:ring-red-400' : ''}
              />
              {loginError && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <Icon name="CircleAlert" size={14} /> Неверный пароль
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleLogin} className="w-full rounded-full gap-2" size="lg">
              <Icon name="LogIn" size={18} /> Войти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;