---
title: Design Philosophy
aside: false
---

# {{ $frontmatter.title }}

<img src="https://user-images.githubusercontent.com/13007891/210392977-03a3b140-ec63-4ce9-b6e3-0a0f7cac6cbe.png" alt="Civet logo" style="width: 33%; float: right; margin: 0 0 1em 1em">

Civet is a **large language that feels small**. Civet is large because it is mostly a **superset of TypeScript**,
an already large language. Civet feels small because of the coherent design aesthetic: related
features look and behave similarly, so when seeing a new feature you can have a good idea what it does,
and your existing knowledge of JavaScript and other languages leads you in the right direction.

Civet works with **existing tools**. We're not trying to replace the TypeScript type checker; we want to
amplify its power. We're not trying to change ES semantics; we want to present them in a coherent and expressive
way.

**Less syntax** is preferred.

**Context matters**. The same tokens can mean different things in different contexts. This shouldn't be arbitrary
but based on pragmatic concerns. Things should be consistent where possible, especially conceptually.

Civet builds on top of **history**. We've taken inspiration from languages like CoffeeScript, Elm, LiveScript, Flow,
Haskell, Elixir, Erlang, Python, Perl, Ruby, Crystal, Bash, and others.

Civet is **pragmatic**. Civet design is informed by 25+ years of JavaScript development. Frontend frameworks
have come and gone but they all addressed issues that were important for their time. We focus heavily on
addressing concerns that real developers feel every day. A key criteria for evaluating features is "how does it
work in practice?".

Civet **evolves**. As the official JS and TS specifications evolve into the future, Civet also evolves favoring **compatibility**.
This may lead us to difficult choices where the future spec has evolved differently than we anticipated (pipe operators,
do expressions, pattern matching). In those cases, Civet will adapt to match the latest spec while providing configuration
options to allow migration bit by bit while keeping existing code working.

Civet is **configurable**. There is no single "right way" for everyone at all times. Some of us have older CoffeeScript
codebases that would benefit from added types. Others have massive TypeScript applications that could benefit from
new language features and shorthand syntax. Civet provides a way to get the benefits bit by bit without a complete
rewrite. This same configurability lets us experiment with language features to gain experience and improve them before
locking them in. It also allows us to adapt to a changing future.
