---
title: Abstract model vs concrete model in Python Django
description: "The different between Abstract model and Concrete model in Python Django"
date: "2022-02-21"
tags:
  - python
  - django
---

## Abstract Model

- In Django, abstract base classes are useful when you want to put some common information into several other models.

- You write your base class and put `abstract=True` in the Meta class.

- This model will then not be used to create any database table.

- Instead, when it is used as a base class for other models, its fields will be added to those of the child class.

- An abstract base class and a child class.

```python
from django.db import models

class CommonInfo(models.Model):
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()

    class Meta:
        abstract = True

class Student(CommonInfo):
    home_group = models.CharField(max_length=5)
```

- The `Student` model will have three fields: `name`, `age` and `home_group`.

- The `CommonInfo` model cannot be used as a normal Django model.

## Concrete Model

- Concrete models are regular Django models that inherit directly from `django.db.models.Model`.

- They result in a database table being created when you run migrations.

- They can be queried directly, and you can create instances of them.

- Example of a concrete model.

```python
rom django.db import models

class Person(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
```

- When you run `python manage.py makemigrations` and `python manage.py migrate`, a table for `Person` will be created in your database.

- You can then use this model to create, read, update, and delete records in that table.

## References

- Django documentation. (n.d.). _Model inheritance_. Retrieved November 21, 2023, from [https://docs.djangoproject.com/en/3.2/topics/db/models/#model-inheritance](https://docs.djangoproject.com/en/3.2/topics/db/models/#model-inheritance)
- Vitor Freitas Blog. (n.d.). _When to Use Abstract Models in Django_. Retrieved November 21, 2023, from [https://www.vitorfreitas.com/when-to-use-abstract-models-in-django/](https://www.vitorfreitas.com/when-to-use-abstract-models-in-django/)
