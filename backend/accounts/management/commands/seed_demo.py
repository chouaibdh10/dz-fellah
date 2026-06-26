from __future__ import annotations

from dataclasses import dataclass

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from products.models import Product

User = get_user_model()


@dataclass(frozen=True)
class DemoUserSpec:
    email: str
    password: str
    role: str
    name: str
    phone: str = ''
    address: str = ''
    photo: str = ''


class Command(BaseCommand):
    help = "Seed demo users and products (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete existing demo users/products before seeding.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        reset = bool(options.get('reset'))

        admin = DemoUserSpec(
            email='admin@dzfellah.dz',
            password='Admin12345!',
            role='admin',
            name='Admin DZ-Fellah',
        )
        producer = DemoUserSpec(
            email='producteur@ferme.dz',
            password='Producer12345!',
            role='producer',
            name='Ferme Ben Ahmed',
            phone='+213 555 12 34 56',
            address='Tipaza, Algérie',
            photo='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
        )
        client = DemoUserSpec(
            email='client@test.dz',
            password='Client12345!',
            role='client',
            name='Client Test',
            phone='+213 555 98 76 54',
            address='Alger, Algérie',
        )

        demo_emails = {admin.email, producer.email, client.email}

        if reset:
            self.stdout.write(self.style.WARNING('Reset enabled: removing demo users/products...'))
            # Remove products of demo producer first
            Product.objects.filter(producer__email=producer.email).delete()
            User.objects.filter(email__in=demo_emails).delete()

        admin_user = self._get_or_create_user(admin, is_admin=True)
        producer_user = self._get_or_create_user(producer)
        client_user = self._get_or_create_user(client)

        # Seed products for producer
        products_seed = [
            dict(
                name='Tomates Bio',
                price='250.00',
                unit='kg',
                photo='https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600',
                stock=50,
                in_season=True,
                category='legumes',
            ),
            dict(
                name='Oranges Thomson',
                price='180.00',
                unit='kg',
                photo='https://images.unsplash.com/photo-1547514701-42782101795e?w=600',
                stock=30,
                in_season=True,
                category='agrumes',
            ),
            dict(
                name='Miel de Montagne',
                price='1200.00',
                unit='pot (500g)',
                photo='https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
                stock=20,
                in_season=False,
                category='miel',
            ),
            dict(
                name='Pommes de terre',
                price='120.00',
                unit='kg',
                photo='https://images.unsplash.com/photo-1518977676601-b53f82ber17f?w=600',
                stock=100,
                in_season=True,
                category='legumes',
            ),
            dict(
                name='Dattes Deglet Nour',
                price='800.00',
                unit='kg',
                photo='https://images.unsplash.com/photo-1593195643839-7f7e44b3c794?w=600',
                stock=45,
                in_season=True,
                category='dattes',
            ),
            dict(
                name="Huile d'Olive Extra Vierge",
                price='1500.00',
                unit='litre',
                photo='https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
                stock=25,
                in_season=False,
                category='huiles',
            ),
            dict(
                name='Carottes Bio',
                price='150.00',
                unit='kg',
                photo='https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
                stock=60,
                in_season=True,
                category='legumes',
            ),
            dict(
                name='Pommes Golden',
                price='350.00',
                unit='kg',
                photo='https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6cbd6?w=600',
                stock=40,
                in_season=True,
                category='fruits',
            ),
            dict(
                name='Fromage Frais',
                price='400.00',
                unit='pièce (250g)',
                photo='https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600',
                stock=15,
                in_season=False,
                category='laitiers',
            ),
            dict(
                name='Menthe Fraîche',
                price='50.00',
                unit='botte',
                photo='https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600',
                stock=80,
                in_season=True,
                category='herbes',
            ),
        ]

        created_count = 0
        for p in products_seed:
            obj, created = Product.objects.get_or_create(
                producer=producer_user,
                name=p['name'],
                defaults={
                    'price': p['price'],
                    'unit': p['unit'],
                    'photo': p['photo'],
                    'stock': p['stock'],
                    'in_season': p['in_season'],
                    'category': p['category'],
                },
            )
            if created:
                created_count += 1
            else:
                # Keep it fresh
                obj.price = p['price']
                obj.unit = p['unit']
                obj.photo = p['photo']
                obj.stock = p['stock']
                obj.in_season = p['in_season']
                obj.category = p['category']
                obj.save()

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('Demo credentials'))
        self.stdout.write(f"- Admin:     {admin_user.email} / {admin.password}")
        self.stdout.write(f"- Producer:  {producer_user.email} / {producer.password}")
        self.stdout.write(f"- Client:    {client_user.email} / {client.password}")
        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('Products'))
        self.stdout.write(f"- Producer products ensured: {len(products_seed)} (newly created: {created_count})")

    def _get_or_create_user(self, spec: DemoUserSpec, *, is_admin: bool = False):
        user = User.objects.filter(email=spec.email).first()
        if user:
            updated = False
            if getattr(user, 'role', None) != spec.role:
                user.role = spec.role
                updated = True
            if spec.name and getattr(user, 'name', '') != spec.name:
                user.name = spec.name
                updated = True
            if getattr(user, 'phone', '') != spec.phone:
                user.phone = spec.phone
                updated = True
            if getattr(user, 'address', '') != spec.address:
                user.address = spec.address
                updated = True
            if getattr(user, 'photo', '') != spec.photo:
                user.photo = spec.photo
                updated = True

            # Ensure password matches spec
            if not user.check_password(spec.password):
                user.set_password(spec.password)
                updated = True

            # Ensure admin flags
            if is_admin and (not user.is_staff or not user.is_superuser):
                user.is_staff = True
                user.is_superuser = True
                updated = True

            if updated:
                user.save()
            return user

        if is_admin:
            user = User.objects.create_superuser(email=spec.email, password=spec.password)
            user.role = 'admin'
        else:
            user = User.objects.create_user(email=spec.email, password=spec.password, role=spec.role)

        user.name = spec.name
        user.phone = spec.phone
        user.address = spec.address
        user.photo = spec.photo
        user.save()
        return user
