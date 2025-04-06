'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formUrlQuery } from '@/lib/utils'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

type PaginationProps = {
  page: number | string,
  totalPages: number,
  urlParamName?: string,
  searchInput?: boolean
};

const Pagination = ({ page, totalPages, urlParamName, searchInput = true } : PaginationProps ) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputPage, setInputPage] = useState<string>('');

  const handleClick = (btnType: string) => {
    let pageValue: number;

    switch (btnType) {
      case 'first':
        pageValue = 1;
        break;
      case 'last':
        pageValue = totalPages;
        break;
      case 'previous':
        pageValue = Number(page) - 1;
        break;
      case 'next':
        pageValue = Number(page) + 1;
        break;
      default:
        pageValue = Number(page);
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString()
    });

    router.push(newUrl);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputPage(value);
  }

  const handleGoToPage = () => {
    if (!inputPage) return;

    let pageNum = parseInt(inputPage);

    // Validate page number
    if (pageNum < 1) {
      pageNum = 1;
    } else if (pageNum > totalPages) {
      pageNum = totalPages;
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageNum.toString()
    });

    router.push(newUrl);
    setInputPage(''); // Reset input after navigation
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  }

  return totalPages > 0 && (
    <div className='flex items-center gap-2'>
      { Number(page) > 1 && (
        <Button size='lg' variant='outline' disabled={Number(page) === 1} onClick={() => handleClick('first')} aria-label='First page'>
          1
        </Button>
      )}
      { Number(page) > 2 && (
        <Button size='lg' variant='outline' onClick={() => handleClick('previous')} aria-label='Previous page'>
          {Number(page) - 1}
        </Button>
      )}
      <Button size='lg' variant='outline' disabled={true} aria-label='Current page'>
        {page}
      </Button>
      { Number(page) < totalPages - 1 && (
        <Button size='lg' variant='outline' onClick={() => handleClick('next')} aria-label='Next page'>
          {Number(page) + 1}
        </Button>
      )}
      { Number(page) < totalPages  && (
        <Button size='lg' variant='outline' onClick={() => handleClick('last')} aria-label='Last page'>
          { totalPages }
        </Button>
      )}
      { searchInput && (
        <div className='flex items-center mx-2'>
          <Input
            type="text"
            value={inputPage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={`1-${totalPages}`}
            className="w-16 h-10 text-center placeholder:text-muted-foreground font-medium"
            aria-label="Go to page"
          />
        </div>
      )}
    </div>
  )
}

export default Pagination