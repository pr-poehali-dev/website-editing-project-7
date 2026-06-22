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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const HERO_IMAGE =
  'https://cdn.poehali.dev/projects/558acf59-52cc-49bf-86a4-c54c112bdadd/files/8a8d0940-3183-4d02-9e0d-67b0ac823dca.jpg';

const CATEGORIES = [
  { id: 'care', label: 'Уход за ребёнком', icon: 'Baby', color: 'bg-rose-100 text-rose-700' },
  { id: 'health', label: 'Здоровье', icon: 'HeartPulse', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'development', label: 'Развитие', icon: 'Sparkles', color: 'bg-violet-100 text-violet-700' },
  { id: 'nutrition', label: 'Питание', icon: 'Apple', color: 'bg-amber-100 text-amber-700' },
  { id: 'treatment', label: 'Лечение ребёнка', icon: 'Stethoscope', color: 'bg-sky-100 text-sky-700' },
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
    author: 'Мария Иванова',
    category: 'nutrition',
    title: 'Первый прикорм без стресса',
    content:
      'Начинали с овощных пюре по чайной ложке. Главное — не торопиться и следить за реакцией. Через месяц малыш ел уже всё с удовольствием!',
    status: 'published',
    date: '5 часов назад',
  },
  {
    id: 3,
    author: 'Ольга Смирнова',
    category: 'development',
    title: 'Развивающие игры до года',
    content:
      'Простые игры с фактурными игрушками отлично развивают мелкую моторику. Рассказываю, что работало у нас лучше всего.',
    status: 'published',
    date: 'вчера',
  },
];

const Index = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    author: '',
    title: '',
    category: '',
    content: '',
  });

  const resetForm = () => setForm({ author: '', title: '', category: '', content: '' });

  const handleSubmit = () => {
    if (!form.author.trim() || !form.title.trim() || !form.category || !form.content.trim()) {
      toast({
        title: 'Заполните все поля',
        description: 'Имя, заголовок, раздел и текст обязательны.',
        variant: 'destructive',
      });
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      author: form.author.trim(),
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      status: 'pending',
      date: 'только что',
    };

    setPosts((prev) => [newPost, ...prev]);
    resetForm();
    setOpen(false);
    toast({
      title: 'Пост отправлен на модерацию 🚀',
      description: 'После проверки он появится в общей ленте.',
    });
  };

  const visiblePosts = posts.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Icon name="Heart" size={20} />
            </div>
            <span className="font-display text-3xl text-primary">Мамоград</span>
          </div>
          <NewPostButton open={open} setOpen={setOpen} form={form} setForm={setForm} onSubmit={handleSubmit} />
        </div>
      </header>

      {/* Hero */}
      <section className="container grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Icon name="Users" size={16} /> Сообщество заботливых мам
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Делитесь опытом{' '}
            <span className="font-display text-primary">материнства</span> вместе
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Публикуйте посты об уходе, здоровье, развитии и питании малышей. Каждый пост
            проходит модерацию — в ленте только полезное и доброе.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <NewPostButton open={open} setOpen={setOpen} form={form} setForm={setForm} onSubmit={handleSubmit} big />
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Смотреть ленту
            </Button>
          </div>
        </div>
        <div className="animate-scale-in">
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20">
            <img src={HERO_IMAGE} alt="Мама с малышом" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="feed" className="container py-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
            >
              <Icon name={cat.icon} size={16} />
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Posts */}
      <main className="container grid gap-5 pb-20 pt-4 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
            <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-50" />
            В этом разделе пока нет постов. Будьте первой!
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
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cat?.color}`}
                >
                  <Icon name={cat?.icon || 'Tag'} size={13} />
                  {cat?.label}
                </span>
                {post.status === 'pending' && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <Icon name="Clock" size={12} /> На проверке
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold leading-snug">{post.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.content}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
            </article>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center gap-2 py-10 text-center">
          <span className="font-display text-2xl text-primary">Мамоград</span>
          <p className="text-sm text-muted-foreground">
            Платформа для публикации и обмена постами о материнстве
          </p>
        </div>
      </footer>
    </div>
  );
};

function NewPostButton({
  open,
  setOpen,
  form,
  setForm,
  onSubmit,
  big,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: { author: string; title: string; category: string; content: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ author: string; title: string; category: string; content: string }>
  >;
  onSubmit: () => void;
  big?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={big ? 'lg' : 'default'} className="rounded-full gap-2">
          <Icon name="PenLine" size={big ? 20 : 16} />
          Написать пост
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Новый пост</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Ваше имя</label>
            <Input
              placeholder="Например, Анна"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            />
          </div>
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
          <div className="flex items-center gap-2 rounded-2xl bg-accent/60 p-3 text-sm text-accent-foreground">
            <Icon name="ShieldCheck" size={18} />
            Пост появится в ленте после проверки модератором.
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} className="w-full rounded-full gap-2" size="lg">
            <Icon name="Send" size={18} />
            Отправить на модерацию
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Index;
