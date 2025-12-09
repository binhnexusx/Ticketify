// Footer.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  Mail,
  MailOpen,
  Copyright,
  MapPinHouse,
  PhoneCall,
  type LucideIcon,
} from 'lucide-react';

type FooterSection = { title: string; items: string[] };
export const footerSections: FooterSection[] = [
  {
    title: 'About Us',
    items: ['Our Story', 'Work with us', 'Press & Media', 'Privacy & Security'],
  },
  {
    title: 'We Offer',
    items: ['Trip Sponsorship', 'Best Deals', 'Last Minutes Flights', 'AI-Driven Search'],
  },
  { title: 'Headquarters', items: ['England', 'France', 'Canada', 'Iceland'] },
  {
    title: 'Travel Blogs',
    items: ['Bali Travel Guide', 'Sri Travel Guide', 'Peru Travel Guide', 'Swiss Travel Guide'],
  },
  { title: 'Activities', items: ['Tour Leading', 'Cruising & Sailing', 'Camping', 'Kayaking'] },
  { title: 'Service', items: ['Report Error', 'Ask Online', 'Travel Insurance'] },
];

export const socialLinks: { icon: LucideIcon; href: string }[] = [
  { icon: Linkedin, href: '#' },
  { icon: Send, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Facebook, href: '#' },
  { icon: Instagram, href: '#' },
];

export const paymentLogos: { src: string; alt: string }[] = [
  { src: '/public/assets/images/visa-card.png', alt: 'Visa card' },
  { src: '/public/assets/images/american-express.png', alt: 'American Express' },
  { src: '/public/assets/images/master-card.png', alt: 'MasterCard' },
  { src: '/public/assets/images/paypal.png', alt: 'PayPal' },
];

export const bottomInfos: { icon: LucideIcon; text: string }[] = [
  { icon: Copyright, text: 'Copyright EasySet24' },
  { icon: MailOpen, text: 'easyset24@gmail.com' },
  { icon: MapPinHouse, text: '123 Oxford Street, London' },
  { icon: PhoneCall, text: '+44 20 7123 4567' },
];

const SocialIcons = () => (
  <div className="flex gap-3 text-2xl text-root-primary-500">
    {socialLinks.map(({ icon: Icon, href }) => (
      <NavLink key={href} to={href} target="_blank" rel="noopener noreferrer">
        <Icon />
      </NavLink>
    ))}
  </div>
);

const Footer = () => {
  return (
    <footer className="w-full pt-2 bg-neutral-100">
      <div className="px-4 mx-auto max-w-7xl md:px-10">
        <div className="flex flex-wrap justify-between gap-6 mt-12">
          {footerSections.map(({ title, items }) => (
            <ul key={title} className="flex flex-col gap-2 min-w-140">
              <li className="font-bold">{title}</li>
              {items.map((item) => (
                <li key={item}>
                  <NavLink to="#">{item}</NavLink>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-6 mt-10 lg:flex-row">
          <div className="flex flex-wrap justify-center gap-4">
            {paymentLogos.map(({ src, alt }) => (
              <NavLink key={alt} to="#">
                <img src={src} alt={alt} className="h-12 w-26" />
              </NavLink>
            ))}
          </div>

          <SocialIcons />

          <div className="flex flex-col">
            <div className="flex items-center gap-2 p-2 mt-1 bg-white border border-gray-300 rounded-sm text-neutral-400">
              <Mail />
              <Input
                className="w-full text-black border-none sm:w-300"
                type="email"
                placeholder="Enter your email"
              />
              <Button type="button">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 p-5 mt-3 text-sm bg-neutral-300 px-9 md:flex-row md:flex-wrap md:justify-between">
        {bottomInfos.slice(0, 1).map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1">
            <Icon className="w-5 h-5 text-root-primary-500" />
            <p>{text}</p>
          </div>
        ))}

        <div className="font-bold text-center">
          "EasySet24: Seamless Journeys, Unrivalled Travel Wisdom!"
        </div>

        {bottomInfos.slice(1).map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1">
            <Icon className="w-5 h-5 text-root-primary-500" />
            <p>{text}</p>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
